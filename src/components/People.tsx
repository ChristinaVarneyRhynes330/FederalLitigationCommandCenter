import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { User, Mail, Phone, Building, Search, Plus, Loader2 } from 'lucide-react';

type PersonType = 'judge' | 'opposing' | 'witness' | 'expert' | 'client';

interface Person {
    id: string;
    name: string;
    type: PersonType;
    role: string;
    email: string;
    phone: string;
    organization?: string;
    status?: string;
    notes?: string;
}

export default function People() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPerson, setNewPerson] = useState<Partial<Person>>({ type: 'witness' });

    useEffect(() => {
        fetchPeople();
    }, []);

    async function fetchPeople() {
        try {
            setLoading(true);
            if (!supabase) {
                setPeople([
                    { id: '1', name: 'Hon. Sarah Johnson', type: 'judge', role: 'District Judge', email: 'chambers@district.court', phone: '555-0100', organization: 'U.S. District Court' },
                    { id: '2', name: 'Michael Chen', type: 'opposing', role: 'Lead Counsel', email: 'mchen@opposingfirm.com', phone: '555-0200', organization: 'Smith & Associates' },
                    { id: '3', name: 'Dr. Emily Williams', type: 'expert', role: 'Medical Expert', email: 'ewilliams@medexperts.com', phone: '555-0300', status: 'Retained' },
                    { id: '4', name: 'Jane Doe', type: 'witness', role: 'Fact Witness', email: 'jdoe@email.com', phone: '555-0400', status: 'Contacted' }
                ]);
                setLoading(false);
                return;
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('people')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('name');

                if (error) throw error;
                setPeople(data || []);
            }
        } catch (error) {
            console.error('Error fetching people:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddPerson() {
        try {
            if (!supabase) {
                alert('Demo mode: Contact would be saved here');
                setShowAddForm(false);
                setNewPerson({ type: 'witness' });
                return;
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase.from('people').insert([{
                ...newPerson,
                user_id: user.id
            }]);

            if (error) throw error;
            setShowAddForm(false);
            setNewPerson({ type: 'witness' });
            fetchPeople();
        } catch (error) {
            alert('Error adding contact');
        }
    }

    const filteredPeople = people.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">People</h1>
                    <p className="text-slate-500 mt-2">Manage contacts & witnesses</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary flex gap-2">
                    <Plus className="w-4 h-4" /> Add Contact
                </button>
            </div>

            {showAddForm && (
                <div className="card p-6 mb-6">
                    <h3 className="mb-4 font-semibold">New Contact</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input className="input" placeholder="Full Name" onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                        <input className="input" placeholder="Role (e.g. Lead Counsel)" onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                        <input className="input" placeholder="Email" onChange={e => setNewPerson({...newPerson, email: e.target.value})} />
                        <input className="input" placeholder="Phone" onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddPerson} className="btn btn-primary">Save</button>
                        <button onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
                    </div>
                </div>
            )}

            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="bg-transparent border-none outline-none flex-1"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-rose-500"/></div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPeople.map(person => (
                            <div key={person.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                                        {person.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{person.name}</h3>
                                        <p className="text-sm text-slate-600">{person.role}</p>
                                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                            {person.email && <span className="flex gap-1 items-center"><Mail className="w-3 h-3"/> {person.email}</span>}
                                            {person.phone && <span className="flex gap-1 items-center"><Phone className="w-3 h-3"/> {person.phone}</span>}
                                        </div>
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