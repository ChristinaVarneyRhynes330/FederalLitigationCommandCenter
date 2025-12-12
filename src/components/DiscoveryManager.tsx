import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Search, Loader2 } from 'lucide-react';

export default function DiscoveryManager() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('documents').select('*').order('created_at', {ascending: false});
                setFiles(data || []);
            }
            setLoading(false);
        }
        fetch();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Discovery Manager</h1>
            <div className="card p-6">
                {loading ? <Loader2 className="animate-spin mx-auto text-rose-500"/> : (
                    <div className="space-y-2">
                        {files.map(f => (
                            <div key={f.id} className="p-4 border rounded hover:bg-slate-50">
                                <p className="font-medium">{f.name}</p>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{f.category || 'General'}</span>
                            </div>
                        ))}
                        {files.length === 0 && <p className="text-center text-slate-500">No discovery files.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}