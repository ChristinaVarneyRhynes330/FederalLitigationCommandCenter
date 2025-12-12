import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { DollarSign, Plus, Loader2 } from 'lucide-react';

interface Expense {
    id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
    status: string;
}

export default function Finance() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({ status: 'pending' });

    useEffect(() => { fetchExpenses(); }, []);

    async function fetchExpenses() {
        setLoading(true);
        if (!supabase) {
            setExpenses([
                { id: '1', date: '2024-12-01', category: 'Filing Fees', description: 'District Court Filing', amount: 402, status: 'paid' },
                { id: '2', date: '2024-12-05', category: 'Expert Witness', description: 'Dr. Smith Consultation', amount: 5000, status: 'paid' },
                { id: '3', date: '2024-12-10', category: 'Deposition', description: 'Court Reporter Services', amount: 850, status: 'pending' }
            ]);
            setLoading(false);
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false });
            setExpenses(data || []);
        }
        setLoading(false);
    }

    async function handleAddExpense() {
        if (!supabase) {
            alert('Demo mode: Expense would be saved here');
            setShowForm(false);
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from('expenses').insert([{ ...newExpense, user_id: user.id, amount: Number(newExpense.amount) }]);
        setShowForm(false);
        fetchExpenses();
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-[#9F5166] to-[#6B3544] text-white shadow-xl">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Litigation Finance</h1>
                        <p className="opacity-80">Total Spent: <span className="text-2xl font-bold ml-2">${total.toLocaleString()}</span></p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="btn bg-white/20 hover:bg-white/30 text-white border-none flex gap-2">
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card p-6">
                    <h3 className="mb-4 font-semibold">New Expense</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input type="date" className="input" onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                        <input type="number" placeholder="Amount" className="input" onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
                        <input type="text" placeholder="Category" className="input" onChange={e => setNewExpense({...newExpense, category: e.target.value})} />
                        <input type="text" placeholder="Description" className="input" onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                    </div>
                    <button onClick={handleAddExpense} className="btn btn-primary">Save Expense</button>
                </div>
            )}

            <div className="card p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Expense Ledger</h3>
                {loading ? <Loader2 className="animate-spin mx-auto text-rose-500" /> : (
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenses.map(exp => (
                            <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">{exp.date}</td>
                                <td className="py-3 px-4"><span className="badge badge-gray">{exp.category}</span></td>
                                <td className="py-3 px-4">{exp.description}</td>
                                <td className="py-3 px-4 font-bold text-slate-700">${exp.amount.toLocaleString()}</td>
                                <td className="py-3 px-4 capitalize text-xs">{exp.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}