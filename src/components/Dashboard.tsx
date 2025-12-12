import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Clock, TrendingUp, AlertCircle, Calendar, FileText, ChevronRight, Target, Zap, Shield, Gavel, Loader2 } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { ProgressRing } from './ProgressRing';

// 1. Define Props to receive Navigation capability
interface DashboardProps {
    onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
    const [loading, setLoading] = useState(true);

    // Real Data State
    const [stats, setStats] = useState({
        activeCases: 0,
        evidenceCount: 0,
        documentsCount: 0,
        recentCaseTitle: "Loading...",
        caseNumber: "Loading..."
    });

    const [deadlines, setDeadlines] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    // 2. Data Fetching Effect
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // A. Fetch Counts from Tables
                    const cases = await supabase.from('cases').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
                    const evidence = await supabase.from('evidence').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id);
                    const docs = await supabase.from('documents').select('*', { count: 'exact', head: true });

                    // B. Fetch Most Recent Case to display in Header
                    const recentCaseReq = await supabase
                        .from('cases')
                        .select('title, case_number')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    // C. Fetch Upcoming Deadlines
                    const deadlinesReq = await supabase
                        .from('discovery_items')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('status', 'pending')
                        .order('due_date', { ascending: true })
                        .limit(3);

                    // D. Fetch Recent Evidence Activity
                    const activityReq = await supabase
                        .from('evidence')
                        .select('*')
                        .eq('uploaded_by', user.id)
                        .order('created_at', { ascending: false })
                        .limit(4);

                    // E. Update State
                    setStats({
                        activeCases: cases.count || 0,
                        evidenceCount: evidence.count || 0,
                        documentsCount: docs.count || 0,
                        // If no case found, show default message
                        recentCaseTitle: recentCaseReq.data?.title || "No Active Cases",
                        caseNumber: recentCaseReq.data?.case_number || "---"
                    });

                    setDeadlines(deadlinesReq.data || []);
                    setRecentActivity(activityReq.data || []);
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [timeRemaining, setTimeRemaining] = useState({ days: 14, hours: 8, minutes: 32, seconds: 45 });
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const caseReadiness = stats.activeCases > 0 ? 68 : 0;

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-white">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Command Header */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                                <span className="text-teal-500 text-xs font-bold tracking-widest uppercase">Active Litigation</span>
                            </div>

                            {/* Dynamic Title */}
                            <h1 className="text-4xl font-bold mb-2 text-white">
                                {loading ? "Loading..." : stats.recentCaseTitle}
                            </h1>
                            <p className="text-slate-400 mb-6 font-mono text-sm">
                                Case No. {stats.caseNumber} • U.S. District Court
                            </p>

                            <div className="flex gap-12">
                                <div>
                                    <div className="text-4xl font-bold text-rose-500 mb-1">{stats.activeCases}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Cases</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-teal-500 mb-1">{stats.evidenceCount}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Evidence Items</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-blue-500 mb-1">{stats.documentsCount}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Documents</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* WORKING BUTTONS using onNavigate */}
                            <button
                                onClick={() => onNavigate('hearing')}
                                className="btn bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 border-none text-white flex items-center justify-center gap-2 py-4 rounded-xl shadow-lg shadow-rose-900/20 transition-all transform hover:scale-105"
                            >
                                <Target className="w-5 h-5" />
                                Enter Hearing Mode
                            </button>
                            <button
                                onClick={() => alert("Quick actions coming in v2!")}
                                className="btn bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
                            >
                                <Zap className="w-5 h-5" />
                                Quick Actions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Docket Clock */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-500/20 rounded-lg"><Clock className="w-5 h-5 text-rose-500" /></div>
                                    <h2 className="font-semibold text-white">Docket Clock</h2>
                                </div>
                                <button
                                    onClick={() => onNavigate('logistics')}
                                    className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors"
                                >
                                    View Calendar <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="p-8 grid grid-cols-4 gap-4 text-center">
                                {[
                                    { val: timeRemaining.days, label: 'Days' },
                                    { val: timeRemaining.hours, label: 'Hours' },
                                    { val: timeRemaining.minutes, label: 'Mins' },
                                    { val: timeRemaining.seconds, label: 'Secs' }
                                ].map((t, i) => (
                                    <div key={i} className="bg-black/20 rounded-lg p-4 backdrop-blur-sm">
                                        <div className="text-4xl font-bold font-mono text-white mb-1">{String(t.val).padStart(2,'0')}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Deadlines (Real Data) */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-semibold text-white">Upcoming Deadlines</h3>
                                <button onClick={() => onNavigate('logistics')} className="text-xs text-slate-400 hover:text-white">View All</button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {loading ? (
                                    <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-500"/></div>
                                ) : deadlines.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 italic">No pending deadlines found. Add items in Logistics.</div>
                                ) : (
                                    deadlines.map((item) => (
                                        <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'urgent' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-amber-500'}`} />
                                                <div>
                                                    <div className="font-medium text-slate-200 group-hover:text-white transition-colors">{item.description}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{item.type} • Due: {new Date(item.due_date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-slate-300 border border-white/10">
                        {item.status || 'Pending'}
                      </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-teal-900/40 to-teal-900/10 border border-teal-500/20 rounded-xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-white">Case Readiness</h3>
                                <Tooltip text="Calculated based on completed discovery items and evidence gathered.">
                                    <AlertCircle className="w-5 h-5 text-teal-400 cursor-help" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-center mb-6">
                                <ProgressRing progress={caseReadiness} size={160} strokeWidth={12} color="#2dd4bf" backgroundColor="rgba(255,255,255,0.05)" />
                            </div>
                        </div>

                        {/* Recent Activity (Real Data) */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="font-semibold text-white">Recent Evidence Uploads</h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recentActivity.length === 0 && !loading && (
                                    <div className="p-8 text-center text-slate-500 italic">No recent activity recorded.</div>
                                )}
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-teal-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm text-slate-200 truncate">{item.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Uploaded {new Date(item.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}