import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { FileText, Headphones, Video, Image as ImageIcon, Download, Tag, Search, Plus, Printer, FolderOpen, Loader2 } from 'lucide-react';
import { DocumentCard } from './illustrations/DocumentCard';
import { EmptyState } from './illustrations/EmptyState';

type Category = 'all' | 'docs' | 'audio' | 'video' | 'photos';

interface Exhibit {
    id: string;
    batesNumber: string;
    name: string;
    category: Category;
    dateAdded: string;
    size: string;
    tags: string[];
}

interface EvidenceVaultProps {
    onAddEvidence?: (evidence: {
        description: string;
        date: string;
        type: string;
        tags?: string[];
    }) => void;
}

export function EvidenceVault({ onAddEvidence }: EvidenceVaultProps = {}) {
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLabelGenerator, setShowLabelGenerator] = useState(false);
    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState(true);

    // FETCH REAL DATA FROM SUPABASE
    useEffect(() => {
        async function fetchEvidence() {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('evidence')
                    .select('*')
                    .eq('uploaded_by', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map database fields to UI fields
                const formattedExhibits: Exhibit[] = (data || []).map((item: any) => ({
                    id: item.id,
                    batesNumber: `EX-${item.id.substring(0, 4).toUpperCase()}`, // Auto-gen Bates from ID
                    name: item.title,
                    category: mapTypeToCategory(item.type),
                    dateAdded: new Date(item.created_at).toLocaleDateString(),
                    size: 'Unknown', // File size isn't in DB yet
                    tags: item.type ? [item.type] : ['Uncategorized']
                }));

                setExhibits(formattedExhibits);
            } catch (error) {
                console.error('Error loading evidence:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvidence();
    }, []);

    // Helper to map DB types to UI categories
    const mapTypeToCategory = (type: string): Category => {
        const lower = (type || '').toLowerCase();
        if (lower.includes('video')) return 'video';
        if (lower.includes('audio')) return 'audio';
        if (lower.includes('photo') || lower.includes('image')) return 'photos';
        return 'docs';
    };

    const categories = [
        { id: 'all' as Category, label: 'All', icon: FileText, count: exhibits.length },
        { id: 'docs' as Category, label: 'Docs', icon: FileText, count: exhibits.filter(e => e.category === 'docs').length },
        { id: 'audio' as Category, label: 'Audio', icon: Headphones, count: exhibits.filter(e => e.category === 'audio').length },
        { id: 'video' as Category, label: 'Video', icon: Video, count: exhibits.filter(e => e.category === 'video').length },
        { id: 'photos' as Category, label: 'Photos', icon: ImageIcon, count: exhibits.filter(e => e.category === 'photos').length },
    ];

    const filteredExhibits = exhibits.filter(exhibit => {
        const matchesCategory = activeCategory === 'all' || exhibit.category === activeCategory;
        const matchesSearch = exhibit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exhibit.batesNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section */}
            <div className="card p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-rose-100 border border-rose-200">
                            <FolderOpen className="w-4 h-4 text-rose-600" />
                            <span className="text-xs font-semibold tracking-wide text-rose-700">EVIDENCE MANAGEMENT</span>
                        </div>
                        <h1 className="text-gray-900 text-3xl font-semibold mb-2">Evidence Vault</h1>
                        <p className="text-gray-600 mb-6">Organize exhibits with professional Bates stamping & cataloging</p>

                        <div className="flex gap-6 mb-6">
                            <div>
                                <div className="text-4xl font-bold text-gray-900 mb-1">{exhibits.length}</div>
                                <div className="text-xs text-gray-600 uppercase tracking-wider">Total Exhibits</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-gray-900 mb-1">{new Set(exhibits.flatMap(e => e.tags)).size}</div>
                                <div className="text-xs text-gray-600 uppercase tracking-wider">Categories</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="btn btn-primary flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Upload Exhibit
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 gap-4">
                            <DocumentCard type="pdf" size={100} />
                            <DocumentCard type="image" size={100} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Pills & Search */}
            <div className="glass-card p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`pill-button flex items-center gap-2 whitespace-nowrap text-sm ${
                                        isActive
                                            ? 'bg-gradient-rose-r text-white'
                                            : 'bg-white/40 text-[#36454F] hover:bg-white/60'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{category.label}</span>
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}>
                    {category.count}
                  </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search exhibits by name or Bates number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Exhibit List */}
            <div className="glass-card">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-gray-900">Exhibits ({filteredExhibits.length})</h3>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                        </div>
                    ) : filteredExhibits.length === 0 ? (
                        <div className="text-center py-12">
                            <EmptyState className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-gray-900 mb-2">No exhibits found</h3>
                            <p className="text-sm text-gray-500">Upload evidence to your cases to see them here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredExhibits.map((exhibit) => {
                                const Icon = categories.find(c => c.id === exhibit.category)?.icon || FileText;

                                return (
                                    <div key={exhibit.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-all">
                                        <div className="flex items-center gap-3 md:gap-4 flex-1 w-full">
                                            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-rose flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="badge badge-primary font-mono text-xs">
                            {exhibit.batesNumber}
                          </span>
                                                    <p className="font-medium text-gray-900 truncate">{exhibit.name}</p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                    <span>{exhibit.dateAdded}</span>
                                                    <span>•</span>
                                                    <div className="flex gap-2">
                                                        {exhibit.tags.map((tag, i) => (
                                                            <span key={i} className="badge badge-outline text-xs">
                                {tag}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="btn btn-sm btn-outline flex items-center gap-2 w-full sm:w-auto">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}