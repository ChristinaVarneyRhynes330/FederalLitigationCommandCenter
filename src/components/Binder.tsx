import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { BookOpen, Printer, Loader2 } from 'lucide-react';

interface BinderItem {
    id: string;
    batesNumber: string;
    title: string;
    type: string;
    created_at: string;
}

export default function Binder() {
    const [evidence, setEvidence] = useState<BinderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBinder() {
            try {
                if (!supabase) {
                    setEvidence([
                        { id: '1', batesNumber: 'EX-001', title: 'Contract Agreement', type: 'PDF', created_at: '12/10/2024' },
                        { id: '2', batesNumber: 'EX-002', title: 'Email Chain - March', type: 'PDF', created_at: '12/10/2024' },
                        { id: '3', batesNumber: 'EX-003', title: 'Financial Records Q3', type: 'Excel', created_at: '12/09/2024' }
                    ]);
                    setLoading(false);
                    return;
                }
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('evidence')
                        .select('*')
                        .eq('uploaded_by', user.id)
                        .order('created_at', { ascending: true });

                    if (data) {
                        setEvidence(data.map((item: any, index: number) => ({
                            id: item.id,
                            batesNumber: `EX-${String(index + 1).padStart(3, '0')}`,
                            title: item.title,
                            type: item.type,
                            created_at: new Date(item.created_at).toLocaleDateString()
                        })));
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchBinder();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
                <div>
                    <h1 className="text-3xl font-bold">The Binder</h1>
                    <p className="text-slate-500 mt-2">Trial exhibit assembly</p>
                </div>
                <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print TOC
                </button>
            </div>

            <div className="card p-8 md:p-12 bg-white min-h-[800px] border border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 pb-8 border-b-4 border-slate-800">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-800" />
                        <h2 className="text-4xl mb-4 font-serif font-bold text-slate-900">Trial Binder</h2>
                        <p className="text-slate-500 uppercase tracking-widest">Table of Contents</p>
                    </div>

                    {loading ? (
                        <div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500"/></div>
                    ) : evidence.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            No evidence found. Upload items to the Evidence Vault first.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {evidence.map((item, index) => (
                                <div key={item.id} className="flex items-center justify-between py-4 border-b border-dotted border-slate-300">
                                    <div className="flex gap-4">
                                        <span className="font-mono text-slate-400 font-bold">Ex. {index + 1}</span>
                                        <div>
                                            <p className="font-medium text-slate-900">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.type} • {item.created_at}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-rose-600 font-bold">{item.batesNumber}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}