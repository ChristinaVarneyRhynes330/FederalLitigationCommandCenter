import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Fixed import
import { FileText, Loader2, Plus, Download } from 'lucide-react';

export default function EvidenceVault() {
    const [exhibits, setExhibits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('evidence').select('*').eq('uploaded_by', user.id);
                setExhibits(data || []);
            }
            setLoading(false);
        }
        fetch();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Evidence Vault</h1>
                <button className="btn btn-primary flex gap-2"><Plus className="w-4 h-4" /> Upload</button>
            </div>
            <div className="card p-6">
                {loading ? <Loader2 className="animate-spin mx-auto text-rose-500"/> : (
                    <div className="space-y-3">
                        {exhibits.map(ex => (
                            <div key={ex.id} className="flex justify-between p-4 bg-slate-50 rounded">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-rose-100 rounded flex items-center justify-center text-rose-600"><FileText className="w-5 h-5"/></div>
                                    <div>
                                        <p className="font-medium">{ex.title}</p>
                                        <p className="text-xs text-slate-500">{ex.type} • {new Date(ex.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button className="btn btn-ghost btn-sm"><Download className="w-4 h-4"/></button>
                            </div>
                        ))}
                        {exhibits.length === 0 && <p className="text-center text-slate-500 py-8">No evidence found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}