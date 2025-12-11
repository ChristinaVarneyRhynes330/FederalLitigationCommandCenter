import { useState } from 'react';
import { DollarSign, Upload, Download, TrendingUp, Calendar, PieChart } from 'lucide-react';
import { MiniChart } from './MiniChart';
import { ProgressRing } from './ProgressRing';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  receipt: boolean;
  status: 'pending' | 'approved' | 'reimbursed';
}

export function Finance() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const expenses: Expense[] = [
    { id: '1', date: '2025-12-08', category: 'Expert Witness', description: 'Dr. Smith - Initial Consultation', amount: 2500, receipt: true, status: 'approved' },
    { id: '2', date: '2025-12-05', category: 'Filing Fees', description: 'Motion for Summary Judgment', amount: 450, receipt: true, status: 'reimbursed' },
    { id: '3', date: '2025-12-01', category: 'Deposition', description: 'Court Reporter - Jane Doe Deposition', amount: 875, receipt: true, status: 'approved' },
    { id: '4', date: '2025-11-28', category: 'Travel', description: 'Flight to Dallas for hearing', amount: 420, receipt: true, status: 'reimbursed' },
    { id: '5', date: '2025-11-25', category: 'Research', description: 'Westlaw subscription (Nov)', amount: 350, receipt: true, status: 'approved' },
    { id: '6', date: '2025-11-20', category: 'Expert Witness', description: 'Engineering expert - Report preparation', amount: 5000, receipt: true, status: 'approved' },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);
  const reimbursedExpenses = expenses.filter(e => e.status === 'reimbursed').reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'reimbursed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Section - Rose Gold Gradient */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, #9F5166 0%, #8B4757 50%, #6B3544 100%)',
          boxShadow: '0 20px 40px rgba(159, 81, 102, 0.3)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
          }}
        />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(13, 148, 136, 0.2)', border: '1px solid rgba(13, 148, 136, 0.3)' }}>
              <span className="text-xs font-semibold" style={{ color: '#14F8C9' }}>FINANCIAL TRACKING</span>
            </div>
            <h1 className="text-white text-4xl font-semibold mb-2">Litigation Finance</h1>
            <p className="text-pink-200 mb-6">Track expenses, manage budgets, and monitor costs</p>
            
            <div className="flex gap-6 mb-6">
              <div>
                <div className="text-3xl font-semibold text-white mb-1">${(totalExpenses / 1000).toFixed(1)}k</div>
                <div className="text-xs text-pink-200 uppercase tracking-wide">Total Spent</div>
              </div>
              <div className="w-px bg-pink-400 opacity-30" />
              <div>
                <div className="text-3xl font-semibold" style={{ color: '#14F8C9' }}>${(approvedExpenses / 1000).toFixed(1)}k</div>
                <div className="text-xs text-pink-200 uppercase tracking-wide">Approved</div>
              </div>
              <div className="w-px bg-pink-400 opacity-30" />
              <div>
                <div className="text-3xl font-semibold text-white mb-1">{expenses.length}</div>
                <div className="text-xs text-pink-200 uppercase tracking-wide">Transactions</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="btn btn-secondary flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Add Expense
              </button>
              <button className="btn flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div 
              className="relative p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            >
              <ProgressRing 
                progress={65} 
                size={200} 
                strokeWidth={16}
                color="#14F8C9"
                backgroundColor="rgba(255, 255, 255, 0.2)"
                label="Budget Used"
              />
              <div className="mt-4 text-center">
                <div className="text-sm text-white/80">$9,595 of $15,000 budget</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="glass-card-teal p-4 md:p-6 border border-teal/30">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-teal" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Total Expenses</p>
          </div>
          <p className="text-2xl md:text-3xl text-deep-teal">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="glass-card-sage p-4 md:p-6 border border-sage/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-sage" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Approved</p>
          </div>
          <p className="text-2xl md:text-3xl text-sage">${approvedExpenses.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 md:w-5 md:h-5 text-[#B76E79]" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Reimbursed</p>
          </div>
          <p className="text-2xl md:text-3xl text-[#B76E79]">${reimbursedExpenses.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 md:p-6 bg-gradient-to-br from-white/60 to-[#E7D8C5]/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#36454F]/70" />
            <p className="text-xs md:text-sm text-[#36454F]/70">This Month</p>
          </div>
          <p className="text-2xl md:text-3xl text-[#36454F]">$3,770</p>
        </div>
      </div>

      {/* Add Expense Form */}
      {showExpenseForm && (
        <div className="glass-card p-6">
          <h3 className="mb-4">Add New Expense</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Category</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50">
                  <option>Expert Witness</option>
                  <option>Filing Fees</option>
                  <option>Deposition</option>
                  <option>Travel</option>
                  <option>Research</option>
                  <option>Copying/Printing</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Description</label>
              <input 
                type="text" 
                placeholder="Brief description of expense"
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Receipt</label>
                <div className="flex items-center gap-3 h-full">
                  <button className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F] flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Receipt
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white">
                Save Expense
              </button>
              <button 
                onClick={() => setShowExpenseForm(false)}
                className="pill-button bg-white/60 text-[#36454F]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="glass-card p-6">
        <h3 className="mb-4">Expenses by Category</h3>
        <div className="space-y-3">
          {Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{category}</span>
                  <span className="text-[#B76E79]">${amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#B76E79] to-[#8B4B56]"
                    style={{ width: `${(amount / totalExpenses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Expense Ledger */}
      <div className="glass-card p-6">
        <h3 className="mb-4">Expense Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B76E79]/20">
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Date</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Category</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Description</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Amount</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Receipt</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-[#B76E79]/10 hover:bg-white/20">
                  <td className="py-3 px-4 text-sm">{expense.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] rounded-full text-xs">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{expense.description}</td>
                  <td className="py-3 px-4 text-sm">${expense.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {expense.receipt ? (
                      <span className="text-green-600 text-xs">✓ Attached</span>
                    ) : (
                      <span className="text-red-600 text-xs">✗ Missing</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}