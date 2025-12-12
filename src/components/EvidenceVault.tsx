import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { FileText, Loader2, Plus, Download, X, Tag } from 'lucide-react';

export default function EvidenceVault() {
    const [exhibits, setExhibits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newEvidence, setNewEvidence] = useState<{
        title: string;
        description: string;
        category: string;
        tags: string;
        file: File | null;
    }>({
        title: '',
        description: '',
        category: 'Exhibit',
        tags: '',
        file: null
    });

    const [currentCase, setCurrentCase] = useState<any | null>(null);

    const fetchEvidenceForCase = async (caseId: string | null) => {
        try {
            setLoading(true);
            if (!supabase) {
                setExhibits([]);
                setLoading(false);
                return;
            }

            if (!caseId) {
                setExhibits([]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('evidence')
                .select('*')
                .eq('case_id', caseId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExhibits(data || []);
        } catch (err) {
            console.error('Error fetching evidence:', err);
            setExhibits([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentCaseAndEvidence = async () => {
        try {
            setLoading(true);
            if (!supabase) {
                setCurrentCase(null);
                setExhibits([]);
                setLoading(false);
                return;
            }

            const { data: casesData, error: casesError } = await supabase
                .from('cases')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1);

            if (casesError) throw casesError;

            const latestCase = casesData && casesData[0];
            setCurrentCase(latestCase || null);

            await fetchEvidenceForCase(latestCase?.id || null);
        } catch (err) {
            console.error('Error fetching case or evidence', err);
            setCurrentCase(null);
            setExhibits([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentCaseAndEvidence();
    }, []);

    // Helper: derive a safe prefix from case data if explicit prefix not provided
    const derivePrefixFromCase = (caseRow: any) => {
        // If the case has an explicit bates_prefix column, use it
        if (caseRow?.bates_prefix && typeof caseRow.bates_prefix === 'string' && caseRow.bates_prefix.trim()) {
            return caseRow.bates_prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        }

        // Otherwise try to derive from case_number (take alphanumeric chars, up to 3 letters)
        const cn = caseRow?.case_number || '';
        if (typeof cn === 'string' && cn.trim()) {
            const alnum = cn.replace(/[^A-Za-z0-9]/g, '');
            if (alnum.length >= 3) return alnum.slice(0, 3).toUpperCase();
            if (alnum.length > 0) return alnum.toUpperCase();
        }

        // Fallback to DEF
        return 'DEF';
    };

    // Generate next Bates number for a case. Prefix is derived from the cases table if available; otherwise use DEF.
    const generateNextBatesNumber = async (caseId: string) => {
        try {
            if (!supabase || !caseId) return 'DEF-001';

            // Attempt to fetch the case row to read bates_prefix (in case currentCase doesn't include it)
            let caseRow = currentCase;
            if (!caseRow || caseRow.id !== caseId) {
                const { data: cdata, error: cerror } = await supabase
                    .from('cases')
                    .select('id, bates_prefix, case_number')
                    .eq('id', caseId)
                    .limit(1)
                    .single();
                if (!cerror) caseRow = cdata;
            }

            const prefix = derivePrefixFromCase(caseRow) || 'DEF';
            const prefixWithDash = prefix.endsWith('-') ? prefix : `${prefix}-`;

            const { data, error } = await supabase
                .from('evidence')
                .select('bates_number')
                .eq('case_id', caseId)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) {
                console.warn('Error fetching last bates number:', error);
                return `${prefixWithDash}001`;
            }

            const last = data && data[0] && data[0].bates_number;
            if (!last || typeof last !== 'string') return `${prefixWithDash}001`;

            // Parse trailing number regardless of prefix
            const m = last.match(/(\d+)$/);
            if (!m) return `${prefixWithDash}001`;
            const num = parseInt(m[1], 10) + 1;
            const next = String(num).padStart(3, '0');
            return `${prefixWithDash}${next}`;
        } catch (err) {
            console.error('generateNextBatesNumber error', err);
            return 'DEF-001';
        }
    };

    // Upload file to Supabase storage and insert evidence row
    const handleSaveEvidence = async () => {
        try {
            if (!supabase) {
                alert('Supabase not configured');
                return;
            }

            if (!currentCase) {
                alert('No active case selected. Create/select a case first.');
                return;
            }

            if (!newEvidence.title) {
                alert('Please provide a title for the evidence');
                return;
            }

            if (!newEvidence.file) {
                alert('Please attach a file (PDF, PNG, JPG)');
                return;
            }

            const file = newEvidence.file;
            const caseId = currentCase.id as string;
            const timestamp = Date.now();
            const safeFilename = `${timestamp}_${file.name}`.replace(/\s+/g, '_');
            const path = `${caseId}/${safeFilename}`;

            // Upload to storage bucket 'case-files' (kept PUBLIC as requested)
            const uploadRes = await supabase.storage.from('case-files').upload(path, file, { cacheControl: '3600', upsert: false });
            if (uploadRes.error) {
                throw uploadRes.error;
            }

            // Get public URL (works for public buckets)
            let publicUrl = '';
            try {
                const { data: urlData, error: urlError } = await supabase.storage.from('case-files').getPublicUrl(path);
                if (urlError) throw urlError;
                publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || '';
            } catch (err) {
                console.warn('getPublicUrl failed, attempting createSignedUrl', err);
                try {
                    const { data: signed, error: signedErr } = await supabase.storage.from('case-files').createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
                    if (signedErr) throw signedErr;
                    publicUrl = (signed as any)?.signedURL || (signed as any)?.signed_url || '';
                } catch (e) {
                    console.error('Failed to obtain public URL for uploaded file', e);
                }
            }

            // Generate next Bates number (prefer server-side RPC for atomic allocation)
            let batesNumber = null;
            try {
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_next_bates_number', { case_uuid: caseId });
                if (rpcError) throw rpcError;
                // rpcData is expected to be the formatted bates string
                batesNumber = rpcData as string;
            } catch (rpcErr) {
                console.warn('RPC get_next_bates_number failed, falling back to client-side generation', rpcErr);
                batesNumber = await generateNextBatesNumber(caseId);
            }

            // Get current user if available
            let userId = null;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                userId = user?.id || null;
            } catch (e) {
                // ignore
            }

            // Insert evidence record
            const insertPayload: any = {
                case_id: caseId,
                title: newEvidence.title,
                description: newEvidence.description || null,
                bates_number: batesNumber,
                category: newEvidence.category || 'Exhibit',
                filename: file.name,
                file_url: publicUrl || null,
                uploaded_by: userId,
                status: 'active'
            };

            if (newEvidence.tags) {
                insertPayload.tags = newEvidence.tags.split(',').map((t) => t.trim()).filter(Boolean);
            }

            const { error: insertError } = await supabase.from('evidence').insert([insertPayload]);
            if (insertError) throw insertError;

            alert(`Uploaded and saved as ${batesNumber}`);
            setShowModal(false);
            setNewEvidence({ title: '', description: '', category: 'Exhibit', tags: '', file: null });

            // Refresh list
            await fetchEvidenceForCase(caseId);
        } catch (err: any) {
            console.error('Error saving evidence:', err);
            alert('Error saving evidence: ' + (err.message || String(err)));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Evidence Vault</h1>
                    <p className="text-gray-600 mt-2">Manage and organize your case evidence</p>
                    {currentCase && (
                        <p className="text-sm text-slate-500 mt-1">Current Case: <strong>{currentCase.title}</strong> — {currentCase.case_number}</p>
                    )}
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Add Evidence
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-rose-500"/>
                    </div>
                ) : exhibits.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Evidence Yet</h3>
                        <p className="text-gray-600 mb-6">Start by adding your first piece of evidence</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg inline-flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Evidence
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {exhibits.map(ex => (
                            <div key={ex.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4 flex-1">
                                        <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 flex-shrink-0">
                                            <FileText className="w-6 h-6"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-gray-900">{ex.title}</h3>
                                                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                    {ex.bates_number}
                                                </span>
                                            </div>
                                            {ex.description && (
                                                <p className="text-sm text-gray-600 mb-2">{ex.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {ex.category || ex.type || 'Document'}
                                                </span>
                                                <span>
                                                    {new Date(ex.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                {ex.tags && (
                                                    <span className="text-gray-400">Tags: {(Array.isArray(ex.tags) ? ex.tags.join(', ') : ex.tags)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {ex.file_url && (
                                            <a href={ex.file_url} target="_blank" rel="noreferrer" className="px-3 py-2 bg-slate-100 rounded-md text-sm text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
                                                <Download className="w-4 h-4" />
                                                View
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ADD EVIDENCE MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Add Evidence</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Title *</label>
                                <input
                                    type="text"
                                    value={newEvidence.title}
                                    onChange={(e) => setNewEvidence({...newEvidence, title: e.target.value})}
                                    placeholder="e.g., Police Report - 2025"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newEvidence.description}
                                    onChange={(e) => setNewEvidence({...newEvidence, description: e.target.value})}
                                    placeholder="Describe the evidence..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={newEvidence.category}
                                        onChange={(e) => setNewEvidence({...newEvidence, category: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="Exhibit">Exhibit</option>
                                        <option value="Pleading">Pleading</option>
                                        <option value="Correspondence">Correspondence</option>
                                        <option value="Order">Order</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={newEvidence.tags}
                                        onChange={(e) => setNewEvidence({...newEvidence, tags: e.target.value})}
                                        placeholder="e.g., police, key-evidence"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attach File *</label>
                                <input
                                    type="file"
                                    accept=".pdf,image/png,image/jpeg"
                                    onChange={(e) => setNewEvidence({...newEvidence, file: e.target.files ? e.target.files[0] : null})}
                                    className="w-full"
                                />
                                {newEvidence.file && (
                                    <p className="text-xs text-slate-500 mt-2">Selected: {newEvidence.file.name}</p>
                                )}
                            </div>

                            {/* Preview of generated Bates (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bates Number (auto)</label>
                                <input
                                    type="text"
                                    value={currentCase ? '(generated on save)' : 'No active case'}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>

                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEvidence}
                                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg transition-all shadow-lg"
                            >
                                Save Evidence
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
