import { useState } from 'react';
import { Calendar, CheckSquare, Plus, Clock, User } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ConferralLog {
  id: string;
  date: string;
  participants: string[];
  topic: string;
  outcome: string;
  nextSteps: string;
}

interface DiscoveryItem {
  id: string;
  type: 'Interrogatories' | 'RFP' | 'RFA' | 'Deposition';
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignee: string;
}

export function Logistics() {
  const [showConferralForm, setShowConferralForm] = useState(false);
  const [showDiscoveryForm, setShowDiscoveryForm] = useState(false);

  const conferralLogs: ConferralLog[] = [
    {
      id: '1',
      date: '2025-12-08',
      participants: ['Sarah Chen (Plaintiff)', 'Michael Roberts (Defendant)'],
      topic: 'Expert witness disclosures and deposition schedule',
      outcome: 'Agreement reached',
      nextSteps: 'Exchange expert reports by Dec 20, depositions Jan 10-15'
    },
    {
      id: '2',
      date: '2025-11-30',
      topic: 'Discovery dispute resolution - Document production',
      participants: ['Sarah Chen', 'Michael Roberts'],
      outcome: 'Partial agreement',
      nextSteps: 'Defendant to produce financial records by Dec 5, meet again Dec 12'
    }
  ];

  const discoveryItems: DiscoveryItem[] = [
    { id: '1', type: 'Interrogatories', description: 'First Set of Interrogatories to Defendant', dueDate: '2025-12-15', status: 'in-progress', assignee: 'Legal Team' },
    { id: '2', type: 'RFP', description: 'Request for Production - Financial Records', dueDate: '2025-12-20', status: 'pending', assignee: 'Sarah Chen' },
    { id: '3', type: 'Deposition', description: 'Deposition of Expert Witness Dr. Smith', dueDate: '2026-01-10', status: 'pending', assignee: 'Michael Roberts' },
    { id: '4', type: 'RFA', description: 'Requests for Admission - Set One', dueDate: '2025-12-12', status: 'completed', assignee: 'Legal Team' },
  ];

  const getStatusColor = (status: DiscoveryItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-[#B76E79]/20 text-[#B76E79]';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1>Logistics</h1>
        <p className="text-[#36454F]/70 mt-2">Manage conferrals, discovery, and case logistics</p>
      </div>

      {/* 3.01(g) Conferral Logger */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2>3.01(g) Conferral Logger</h2>
            <Tooltip text="Federal Rule 26(f) requires parties to confer and develop a discovery plan. Many local rules (like Texas Rule 3.01(g)) mandate good faith efforts to resolve disputes before filing motions.">
              <div className="w-5 h-5 rounded-full bg-[#B76E79]/20 text-[#B76E79] flex items-center justify-center text-xs cursor-help">
                ?
              </div>
            </Tooltip>
          </div>
          <button 
            onClick={() => setShowConferralForm(!showConferralForm)}
            className="btn btn-outline-gray flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Conferral
          </button>
        </div>

        {showConferralForm && (
          <div className="mb-6 p-4 bg-white/40 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Participants</label>
                <input 
                  type="text" 
                  placeholder="Enter names, comma separated"
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Topic Discussed</label>
              <input 
                type="text" 
                placeholder="Brief description of conference topic"
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Outcome</label>
              <textarea 
                placeholder="Summary of what was agreed upon or disagreed"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Next Steps</label>
              <input 
                type="text" 
                placeholder="Action items and deadlines"
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div className="flex gap-2">
              <button className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white">
                Save Log
              </button>
              <button 
                onClick={() => setShowConferralForm(false)}
                className="pill-button bg-white/60 text-[#36454F]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {conferralLogs.map((log) => (
            <div key={log.id} className="p-4 bg-white/40 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#B76E79]" />
                  <div>
                    <p>{log.topic}</p>
                    <p className="text-sm text-[#36454F]/60">{log.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {log.outcome}
                </span>
              </div>
              <div className="ml-8 space-y-2 text-sm">
                <div>
                  <span className="text-[#36454F]/70">Participants: </span>
                  <span>{log.participants.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[#36454F]/70">Next Steps: </span>
                  <span>{log.nextSteps}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovery Control Board */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2>Discovery Control Board</h2>
            <Tooltip text="Track all discovery requests, responses, and deadlines in one centralized dashboard">
              <div className="w-5 h-5 rounded-full bg-[#B76E79]/20 text-[#B76E79] flex items-center justify-center text-xs cursor-help">
                ?
              </div>
            </Tooltip>
          </div>
          <button 
            onClick={() => setShowDiscoveryForm(!showDiscoveryForm)}
            className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Discovery Item</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {showDiscoveryForm && (
          <div className="mb-6 p-4 bg-white/40 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Type</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50">
                  <option>Interrogatories</option>
                  <option>RFP (Request for Production)</option>
                  <option>RFA (Request for Admission)</option>
                  <option>Deposition</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Due Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Description</label>
              <input 
                type="text" 
                placeholder="Brief description of discovery item"
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Assignee</label>
                <input 
                  type="text" 
                  placeholder="Person responsible"
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Status</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white">
                Add Item
              </button>
              <button 
                onClick={() => setShowDiscoveryForm(false)}
                className="pill-button bg-white/60 text-[#36454F]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#B76E79]/20">
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Type</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Description</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Due Date</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Assignee</th>
                <th className="text-left py-3 px-4 text-sm text-[#36454F]/70">Status</th>
              </tr>
            </thead>
            <tbody>
              {discoveryItems.map((item) => (
                <tr key={item.id} className="border-b border-[#B76E79]/10 hover:bg-white/20">
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] rounded-full text-xs">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{item.description}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#36454F]/40" />
                      {item.dueDate}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#36454F]/40" />
                      {item.assignee}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-[#36454F]/70 mb-2">Total Conferences</p>
          <p className="text-2xl text-[#B76E79]">{conferralLogs.length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-[#36454F]/70 mb-2">Active Discovery</p>
          <p className="text-2xl text-[#B76E79]">
            {discoveryItems.filter(d => d.status !== 'completed').length}
          </p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-[#36454F]/70 mb-2">Completed Items</p>
          <p className="text-2xl text-[#B76E79]">
            {discoveryItems.filter(d => d.status === 'completed').length}
          </p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-[#36454F]/70 mb-2">Compliance Rate</p>
          <p className="text-2xl text-[#B76E79]">100%</p>
        </div>
      </div>
    </div>
  );
}