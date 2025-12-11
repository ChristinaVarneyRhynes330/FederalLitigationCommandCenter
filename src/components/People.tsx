import { useState } from 'react';
import { User, Mail, Phone, Building, Search, Plus, Filter } from 'lucide-react';

type PersonType = 'judge' | 'opposing' | 'witness' | 'expert' | 'client';
type WitnessStatus = 'subpoenaed' | 'interviewed' | 'friendly' | 'hostile' | 'pending';

interface Person {
  id: string;
  name: string;
  type: PersonType;
  role: string;
  email: string;
  phone: string;
  organization?: string;
  status?: WitnessStatus;
  notes?: string;
}

export function People() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PersonType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const people: Person[] = [
    {
      id: '1',
      name: 'Hon. Margaret Chen',
      type: 'judge',
      role: 'Presiding Judge',
      email: 'chambers@district.court.gov',
      phone: '(555) 100-2000',
      organization: 'U.S. District Court',
    },
    {
      id: '2',
      name: 'Michael Roberts',
      type: 'opposing',
      role: 'Lead Counsel for Defendant',
      email: 'mroberts@biglaw.com',
      phone: '(555) 200-3000',
      organization: 'Roberts & Associates',
    },
    {
      id: '3',
      name: 'Jane Doe',
      type: 'witness',
      role: 'Former Employee',
      email: 'jane.doe@email.com',
      phone: '(555) 300-4000',
      status: 'interviewed',
      notes: 'Key witness to contract signing. Very cooperative.'
    },
    {
      id: '4',
      name: 'Dr. Robert Smith',
      type: 'expert',
      role: 'Engineering Expert',
      email: 'rsmith@expertwitness.com',
      phone: '(555) 400-5000',
      organization: 'Technical Consultants Inc',
      status: 'friendly',
      notes: 'Ph.D. in Mechanical Engineering. 20+ years experience.'
    },
    {
      id: '5',
      name: 'Thomas Anderson',
      type: 'witness',
      role: 'Project Manager',
      email: 'tanderson@techcorp.com',
      phone: '(555) 500-6000',
      organization: 'TechCorp Industries',
      status: 'subpoenaed',
      notes: 'Defendant employee. May be hostile.'
    },
    {
      id: '6',
      name: 'Sarah Williams',
      type: 'client',
      role: 'Plaintiff',
      email: 'sarah.williams@email.com',
      phone: '(555) 600-7000',
      status: 'friendly',
      notes: 'Primary client. Very responsive and organized.'
    },
    {
      id: '7',
      name: 'David Martinez',
      type: 'witness',
      role: 'Security Guard',
      email: 'dmartinez@security.com',
      phone: '(555) 700-8000',
      status: 'interviewed',
      notes: 'Witnessed incident on security footage.'
    },
  ];

  const typeLabels: Record<PersonType, string> = {
    judge: 'Judge',
    opposing: 'Opposing Counsel',
    witness: 'Witness',
    expert: 'Expert Witness',
    client: 'Client',
  };

  const statusColors: Record<WitnessStatus, string> = {
    subpoenaed: 'bg-yellow-100 text-yellow-700',
    interviewed: 'bg-blue-100 text-blue-700',
    friendly: 'bg-green-100 text-green-700',
    hostile: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700',
  };

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || person.type === filterType;
    return matchesSearch && matchesType;
  });

  const typeCounts = people.reduce((acc, person) => {
    acc[person.type] = (acc[person.type] || 0) + 1;
    return acc;
  }, {} as Record<PersonType, number>);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1>People</h1>
          <p className="text-[#36454F]/70 mt-2">Manage contacts, witnesses, and case participants</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#36454F]/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[#36454F] placeholder-[#36454F]/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#36454F]/40" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as PersonType | 'all')}
              className="flex-1 md:flex-none px-4 py-2 rounded-full bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50 text-sm"
            >
              <option value="all">All Types</option>
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {Object.entries(typeLabels).map(([type, label]) => (
          <div key={type} className="glass-card p-3 md:p-4 text-center">
            <p className="text-xs md:text-sm text-[#36454F]/70 mb-2">{label}</p>
            <p className="text-xl md:text-2xl text-[#B76E79]">{typeCounts[type as PersonType] || 0}</p>
          </div>
        ))}
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="glass-card p-6">
          <h3 className="mb-4">Add New Contact</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Type</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50">
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Role</label>
              <input 
                type="text" 
                placeholder="e.g., Expert Witness, Project Manager"
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#36454F]/70 mb-2">Phone</label>
                <input 
                  type="tel" 
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#36454F]/70 mb-2">Organization (Optional)</label>
              <input 
                type="text" 
                placeholder="Company or institution"
                className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50"
              />
            </div>
            <div className="flex gap-2">
              <button className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white">
                Add Contact
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="pill-button bg-white/60 text-[#36454F]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* People Directory */}
      <div className="glass-card p-6">
        <h3 className="mb-4">Directory ({filteredPeople.length})</h3>
        
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-[#36454F]/20" />
            <p className="text-[#36454F]/60">No contacts found</p>
            <p className="text-sm text-[#36454F]/40 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPeople.map((person) => (
              <div key={person.id} className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-all">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#B76E79] to-[#8B4B56] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg truncate">{person.name}</h3>
                        <p className="text-xs md:text-sm text-[#36454F]/60 truncate">{person.role}</p>
                      </div>
                      <span className="px-2 md:px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] rounded-full text-xs self-start whitespace-nowrap">
                        {typeLabels[person.type]}
                      </span>
                    </div>
                    
                    {person.organization && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-[#36454F]/70 mb-2">
                        <Building className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">{person.organization}</span>
                      </div>
                    )}
                    
                    <div className="space-y-1 text-xs md:text-sm text-[#36454F]/70 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">{person.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span>{person.phone}</span>
                      </div>
                    </div>
                    
                    {person.status && (
                      <div className="mb-2">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs ${statusColors[person.status]}`}>
                          {person.status}
                        </span>
                      </div>
                    )}
                    
                    {person.notes && (
                      <p className="text-xs md:text-sm text-[#36454F]/60 italic mt-2 p-2 bg-white/60 rounded break-words">
                        {person.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}