import { useState } from 'react';
import { FileText, Headphones, Video, Image as ImageIcon, Download, Tag, Search, Plus, Printer, FolderOpen } from 'lucide-react';
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

  const exhibits: Exhibit[] = [
    { id: '1', batesNumber: 'EX-001-0001', name: 'Employment Contract.pdf', category: 'docs', dateAdded: '2025-11-15', size: '2.3 MB', tags: ['Contract', 'Key Evidence'] },
    { id: '2', batesNumber: 'EX-001-0045', name: 'Email Thread - Project Alpha.pdf', category: 'docs', dateAdded: '2025-11-18', size: '1.1 MB', tags: ['Correspondence'] },
    { id: '3', batesNumber: 'EX-002-0001', name: 'Witness Interview - Jane Doe.mp3', category: 'audio', dateAdded: '2025-11-20', size: '45.2 MB', tags: ['Witness', 'Testimony'] },
    { id: '4', batesNumber: 'EX-003-0001', name: 'Security Footage - Lobby.mp4', category: 'video', dateAdded: '2025-11-22', size: '523 MB', tags: ['Surveillance', 'Key Evidence'] },
    { id: '5', batesNumber: 'EX-004-0001', name: 'Product Defect Photo 1.jpg', category: 'photos', dateAdded: '2025-11-25', size: '4.5 MB', tags: ['Physical Evidence'] },
    { id: '6', batesNumber: 'EX-001-0102', name: 'Financial Statements Q3.pdf', category: 'docs', dateAdded: '2025-11-28', size: '3.7 MB', tags: ['Financial', 'Discovery'] },
    { id: '7', batesNumber: 'EX-004-0012', name: 'Accident Scene Photo.jpg', category: 'photos', dateAdded: '2025-12-01', size: '6.1 MB', tags: ['Scene', 'Key Evidence'] },
  ];

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
      {/* Simplified Hero */}
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
                <div className="text-4xl font-bold text-rose-600 mb-1">{exhibits.filter(e => e.tags.includes('Key Evidence')).length}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Key Evidence</div>
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
              <button className="btn btn-secondary flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Index
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <DocumentCard type="pdf" size={100} />
              <DocumentCard type="image" size={100} />
              <DocumentCard type="video" size={100} />
              <DocumentCard type="audio" size={100} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4">
          {/* Category Pills */}
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

          {/* Search Bar */}
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

      {/* Bates Label Generator */}
      {showLabelGenerator && (
        <div className="glass-card p-6">
          <h3 className="mb-4">Exhibit Label Generator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Bates Number</label>
              <input 
                type="text" 
                placeholder="EX-001-0001" 
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Exhibit Name</label>
              <input 
                type="text" 
                placeholder="Employment Contract" 
                className="input w-full"
              />
            </div>
          </div>
          <button className="pill-button bg-gradient-rose-r text-white">
            Generate & Print Label
          </button>
        </div>
      )}

      {/* Exhibit List */}
      <div className="glass-card">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-gray-900">Exhibits ({filteredExhibits.length})</h3>
          <button 
            onClick={() => setShowLabelGenerator(!showLabelGenerator)}
            className="btn btn-sm btn-outline flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Generate Labels
          </button>
        </div>
        
        <div className="p-6">
          {filteredExhibits.length === 0 ? (
            <div className="text-center py-12">
              <EmptyState className="w-24 h-24 mx-auto mb-4 text-gray-300" />
              <h3 className="text-gray-900 mb-2">No exhibits found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or upload new evidence</p>
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
                          <span>{exhibit.size}</span>
                          <span>•</span>
                          <div className="flex gap-2">
                            {exhibit.tags.map(tag => (
                              <span key={tag} className="badge badge-outline text-xs">
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