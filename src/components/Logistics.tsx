import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Calendar, CheckSquare, Plus, Loader2 } from 'lucide-react';

export default function Logistics() {
    const [logs, setLogs] = useState<any[]>([]);
    const [discovery, setDiscovery] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const logsRes = await supabase.from('conferral_logs').select('*').eq('user_id', user.id);
                const discRes = await supabase.from('discovery_items').select('*').eq('user_id', user.id);
                setLogs(logsRes.data || []);
                setDiscovery(discRes.data || []);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Logistics & Conferral</h1>

            {/* Conferral Logs */}
            <div className="card p-6">
                <h2 className="text-xl mb-4 flex items-center gap-2 font-semibold"><Calendar className="w-5 h-5 text-rose-500"/> Conferral Logs</h2>
                {loading ? <Loader2 className="animate-spin text-rose-500"/> : (
                    <div className="space-y-4">
                        {logs.length === 0 && <p className="text-gray-500">No logs recorded yet.</p>}
                        {logs.map(log => (
                            <div key={log.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold">{log.topic}</h3>
                                    <span className="text-sm text-gray-500">{log.date}</span>
                                </div>
                                <p className="text-sm mt-1">Outcome: <span className="text-green-600 font-medium">{log.outcome}</span></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Discovery Items */}
            <div className="card p-6">
                <h2 className="text-xl mb-4 flex items-center gap-2 font-semibold"><CheckSquare className="w-5 h-5 text-teal-600"/> Discovery Deadlines</h2>
                <div className="space-y-2">
                    {discovery.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded hover:bg-slate-100">
                            <span>{item.description}</span>
                            <span className={`badge ${item.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                {item.status}
              </span>
                        </div>
                    ))}
                    {discovery.length === 0 && !loading && <p className="text-gray-500">No active discovery items.</p>}
                </div>
            </div>
        </div>
    );
}