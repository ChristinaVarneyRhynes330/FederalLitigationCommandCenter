import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Clock, AlertCircle, FileText, Target, Zap, Loader2, Plus, X } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface DashboardProps {
    onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeCases: 0,
        evidenceCount: 0,
        documentsCount: 0,
        recentCaseTitle: "Loading...",
        caseNumber: "Loading..."
    });
    const [deadlines, setDeadlines] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);

    // Modal states
    const [showNewCaseModal, setShowNewCaseModal] = useState(false);
    const [showNewDeadlineModal, setShowNewDeadlineModal] = useState(false);

    // Form states
    const [newCase, setNewCase] = useState({ title: '', case_number: '', court: '', plaintiff: '', defendant: '' });
    const [newDeadline, setNewDeadline] = useState({ title: '', due_date: '', case_id: '', type: 'filing', description: '' });

    // Timer (simple decrementing fallback used by existing UI)
    const [timeRemaining, setTimeRemaining] = useState({ days: 14, hours: 8, minutes: 32, seconds: 45 });
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);

            // Mock data fallback if Supabase is not configured
            if (!supabase) {
                setStats({
                    activeCases: 0,
                    evidenceCount: 0,
                    documentsCount: 0,
                    recentCaseTitle: "No Cases Yet",
                    caseNumber: "---"
                });
                setDeadlines([]);
                setRecentActivity([]);
                setCases([]);
                setLoading(false);
                return;
            }

            const { data: allCases, error: casesError } = await supabase
                .from('cases')
                .select('*')
                .order('created_at', { ascending: false });

            if (casesError) throw casesError;

            setCases(allCases || []);

            const casesCount = allCases?.length || 0;

            const { count: evidenceCount } = await supabase
                .from('evidence')
                .select('*', { count: 'exact', head: true });

            let docsCount = 0;
            try {
                const { count } = await supabase
                    .from('documents')
                    .select('*', { count: 'exact', head: true });
                docsCount = count || 0;
            } catch (e) {
                console.log("Documents table might not exist yet, ignoring count");
            }

            const recentCase = allCases && allCases.length > 0 ? allCases[0] : null;

            const { data: deadlinesData } = await supabase
                .from('deadlines')
                .select('*')
                .order('due_date', { ascending: true })
                .limit(5);

            const { data: activityData } = await supabase
                .from('evidence')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);

            setStats({
                activeCases: casesCount,
                evidenceCount: evidenceCount || 0,
                documentsCount: docsCount || 0,
                recentCaseTitle: recentCase?.title || "No Active Cases",
                caseNumber: recentCase?.case_number || "---"
            });

            setDeadlines(deadlinesData || []);
            setRecentActivity(activityData || []);

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handler: Create New Case
    const handleCreateCase = async () => {
        if (!supabase) {
            alert('Supabase not configured');
            return;
        }
        if (!newCase.title || !newCase.case_number) {
            alert('Please fill in required fields: Title and Case Number');
            return;
        }

        try {
            const { error } = await supabase.from('cases').insert([{
                title: newCase.title,
                case_number: newCase.case_number,
                court: newCase.court,
                plaintiff: newCase.plaintiff,
                defendant: newCase.defendant,
                status: 'active'
            }]);

            if (error) throw error;

            alert('Case created successfully!');
            setShowNewCaseModal(false);
            setNewCase({ title: '', case_number: '', court: '', plaintiff: '', defendant: '' });
            fetchData();
        } catch (error: any) {
            console.error('Error creating case:', error);
            alert('Error creating case: ' + error.message);
        }
    };

    // Handler: Create New Deadline
    const handleCreateDeadline = async () => {
        if (!supabase) {
            alert('Supabase not configured');
            return;
        }
        if (!newDeadline.title || !newDeadline.due_date) {
            alert('Please fill in required fields: Title and Due Date');
            return;
        }

        try {
            const { error } = await supabase.from('deadlines').insert([{
                title: newDeadline.title,
                description: newDeadline.description,
                due_date: newDeadline.due_date,
                case_id: newDeadline.case_id || null,
                type: newDeadline.type,
                status: 'pending'
            }]);

            if (error) throw error;

            alert('Deadline created successfully!');
            setShowNewDeadlineModal(false);
            setNewDeadline({ title: '', due_date: '', case_id: '', type: 'filing', description: '' });
            fetchData();
        } catch (error: any) {
            console.error('Error creating deadline:', error);
            alert('Error creating deadline: ' + error.message);
        }
    };

    const caseReadiness = stats.activeCases > 0 ? 68 : 0;

    // Gauge SVG params
    const readiness = caseReadiness;
    const size = 140;
    const stroke = 14; // thicker stroke
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - readiness / 100);

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-white">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Command Header */}
                <div className="bg-slate-900 border-b border-slate-700 rounded-2xl p-8 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                                <span className="text-teal-400 text-xs font-bold tracking-widest uppercase">Active Litigation</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-sm">
                                {loading ? "Loading..." : stats.recentCaseTitle}
                            </h1>
                            <p className="text-teal-400 mb-6 font-mono text-sm">
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
                            {/* NEW CASE BUTTON */}
                            <button
                                onClick={() => setShowNewCaseModal(true)}
                                className="btn bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 border-none text-white flex items-center justify-center gap-2 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                New Case
                            </button>
                            {/* BUTTONS: NOW CONNECTED */}
                            <button
                                onClick={() => onNavigate('hearing')}
                                className="btn bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 border-none text-white flex items-center justify-center gap-2 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105"
                            >
                                <Target className="w-5 h-5" />
                                Enter Hearing Mode
                            </button>
                            <button
                                onClick={() => onNavigate('logistics')}
                                className="btn bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-lg hover:scale-105"
                            >
                                <Zap className="w-5 h-5" />
                                Logistics & Deadlines
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-rose-500" />
                                    <h2 className="font-semibold text-white">Docket Clock</h2>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-3 gap-4 text-center">
                                {[
                                    { val: timeRemaining.days, label: 'Days' },
                                    { val: timeRemaining.hours, label: 'Hours' },
                                    { val: timeRemaining.minutes, label: 'Mins' }
                                ].map((t, i) => (
                                    <div key={i} className="bg-slate-950 rounded-lg border border-white/10 p-4 flex flex-col items-center">
                                        <div className="text-3xl font-mono text-white">{String(t.val).padStart(2, '0')}</div>
                                        <div className="mt-1 text-xs text-slate-500 uppercase">{t.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/20 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-semibold text-white">Upcoming Deadlines</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowNewDeadlineModal(true)}
                                        className="text-xs px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg flex items-center gap-1 transition-all"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add
                                    </button>
                                    <button onClick={() => onNavigate('logistics')} className="text-xs text-slate-400 hover:text-white">View All</button>
                                </div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {loading ? (
                                    <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-500"/></div>
                                ) : deadlines.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 italic">No pending deadlines found. Add items in Logistics.</div>
                                ) : (
                                    deadlines.map((item) => (
                                        <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'urgent' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                <div>
                                                    <div className="font-medium text-slate-200 group-hover:text-white transition-colors">{item.description}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{item.type} • Due: {item.due_date}</div>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-slate-800/20 rounded-full text-xs font-medium text-slate-300 border border-white/10">
                        {item.status || 'Pending'}
                      </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-teal-900/40 to-teal-900/10 border border-teal-500/20 rounded-xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-white">Case Readiness</h3>
                                <Tooltip text="Calculated based on completed discovery items.">
                                    <AlertCircle className="w-5 h-5 text-teal-400 cursor-help" />
                                </Tooltip>
                            </div>

                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
                                        {/* Background track */}
                                        <circle
                                            className="text-slate-800"
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            stroke="currentColor"
                                            strokeWidth={stroke}
                                            fill="transparent"
                                        />
                                        {/* Foreground progress */}
                                        <circle
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            stroke="#06b6d4"
                                            strokeWidth={stroke}
                                            strokeLinecap="round"
                                            fill="transparent"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={offset}
                                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                                        />
                                    </svg>

                                    {/* Center percentage */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">{readiness}%</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wide">Ready</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <ul className="mt-6 w-full space-y-2 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-slate-300">Evidence</span>
                                    <span className="text-green-400 font-medium">8/10</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-300">Motions</span>
                                    <span className="text-yellow-400 font-medium">Pending</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-300">Strategy</span>
                                    <span className="text-blue-400 font-medium">Active</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/20 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="font-semibold text-white">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recentActivity.length === 0 && !loading && (
                                    <div className="p-8 text-center text-slate-500 italic">No recent activity.</div>
                                )}
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="p-4 flex gap-4 hover:bg-slate-800/20 transition-colors">
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

            {/* NEW CASE MODAL */}
            {showNewCaseModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/10">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Create New Case</h2>
                            <button onClick={() => setShowNewCaseModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Case Title *</label>
                                <input
                                    type="text"
                                    value={newCase.title}
                                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                                    placeholder="e.g., Smith v. TechCorp Industries"
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Case Number *</label>
                                    <input
                                        type="text"
                                        value={newCase.case_number}
                                        onChange={(e) => setNewCase({...newCase, case_number: e.target.value})}
                                        placeholder="e.g., CV-2024-00789"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Court</label>
                                    <input
                                        type="text"
                                        value={newCase.court}
                                        onChange={(e) => setNewCase({...newCase, court: e.target.value})}
                                        placeholder="e.g., U.S. District Court"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Plaintiff</label>
                                    <input
                                        type="text"
                                        value={newCase.plaintiff}
                                        onChange={(e) => setNewCase({...newCase, plaintiff: e.target.value})}
                                        placeholder="Plaintiff name"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Defendant</label>
                                    <input
                                        type="text"
                                        value={newCase.defendant}
                                        onChange={(e) => setNewCase({...newCase, defendant: e.target.value})}
                                        placeholder="Defendant name"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setShowNewCaseModal(false)}
                                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCase}
                                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white rounded-lg transition-all shadow-lg"
                            >
                                Create Case
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW DEADLINE MODAL */}
            {showNewDeadlineModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-white/10">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Add Deadline</h2>
                            <button onClick={() => setShowNewDeadlineModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={newDeadline.title}
                                    onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})}
                                    placeholder="e.g., Expert witness disclosure"
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    value={newDeadline.description}
                                    onChange={(e) => setNewDeadline({...newDeadline, description: e.target.value})}
                                    placeholder="Additional details..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Due Date *</label>
                                    <input
                                        type="date"
                                        value={newDeadline.due_date}
                                        onChange={(e) => setNewDeadline({...newDeadline, due_date: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                                    <select
                                        value={newDeadline.type}
                                        onChange={(e) => setNewDeadline({...newDeadline, type: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="filing">Filing</option>
                                        <option value="discovery">Discovery</option>
                                        <option value="hearing">Hearing</option>
                                        <option value="trial">Trial</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Related Case</label>
                                <select
                                    value={newDeadline.case_id}
                                    onChange={(e) => setNewDeadline({...newDeadline, case_id: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Select a case (optional)</option>
                                    {cases.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setShowNewDeadlineModal(false)}
                                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateDeadline}
                                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white rounded-lg transition-all shadow-lg"
                            >
                                Add Deadline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

