import { useState } from 'react';
import { 
  Upload, 
  FolderOpen, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Mail, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Tag,
  Zap,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  FileCheck,
  Shield,
  Copy,
  SortAsc,
  Info
} from 'lucide-react';
import { DiscoveryIntegrationGuide } from './DiscoveryIntegrationGuide';

interface DiscoveryFile {
  id: string;
  name: string;
  size: string;
  uploadedDate: string;
  status: 'processing' | 'ready' | 'flagged';
  aiCategory: string;
  confidence: number;
  batesNumber?: string;
  tags: string[];
  isDuplicate: boolean;
  isPrivileged: boolean;
  extractedText?: string;
  fileType: 'document' | 'image' | 'video' | 'email';
  metadata: {
    author?: string;
    created?: string;
    modified?: string;
    pages?: number;
  };
}

export function DiscoveryManager() {
  const [files, setFiles] = useState<DiscoveryFile[]>([
    {
      id: '1',
      name: 'Contract_Amendment_2024.pdf',
      size: '2.4 MB',
      uploadedDate: '2024-12-09 10:30 AM',
      status: 'ready',
      aiCategory: 'Contracts & Agreements',
      confidence: 98,
      batesNumber: 'DISC-001-0001',
      tags: ['Contract', 'Amendment', 'Key Evidence'],
      isDuplicate: false,
      isPrivileged: false,
      fileType: 'document',
      metadata: {
        author: 'John Smith',
        created: '2024-03-15',
        modified: '2024-03-20',
        pages: 12
      }
    },
    {
      id: '2',
      name: 'Attorney_Client_Memo.docx',
      size: '856 KB',
      uploadedDate: '2024-12-09 10:32 AM',
      status: 'flagged',
      aiCategory: 'Legal Correspondence',
      confidence: 95,
      batesNumber: 'DISC-001-0002',
      tags: ['Privileged', 'Attorney Work Product'],
      isDuplicate: false,
      isPrivileged: true,
      fileType: 'document',
      metadata: {
        author: 'Jane Attorney',
        created: '2024-04-01',
        pages: 3
      }
    },
    {
      id: '3',
      name: 'Email_Thread_ProjectAlpha.msg',
      size: '124 KB',
      uploadedDate: '2024-12-09 10:35 AM',
      status: 'ready',
      aiCategory: 'Email Communications',
      confidence: 99,
      batesNumber: 'DISC-001-0003',
      tags: ['Email', 'Project Alpha', 'Internal'],
      isDuplicate: false,
      isPrivileged: false,
      fileType: 'email',
      metadata: {
        author: 'sarah@techcorp.com',
        created: '2024-03-22'
      }
    },
    {
      id: '4',
      name: 'Defect_Photo_Widget_A.jpg',
      size: '3.2 MB',
      uploadedDate: '2024-12-09 10:40 AM',
      status: 'ready',
      aiCategory: 'Physical Evidence',
      confidence: 92,
      batesNumber: 'DISC-001-0004',
      tags: ['Photo', 'Product Defect', 'Widget'],
      isDuplicate: false,
      isPrivileged: false,
      fileType: 'image',
      metadata: {
        created: '2024-03-10'
      }
    },
    {
      id: '5',
      name: 'Contract_Amendment_2024_DUPLICATE.pdf',
      size: '2.4 MB',
      uploadedDate: '2024-12-09 10:42 AM',
      status: 'flagged',
      aiCategory: 'Contracts & Agreements',
      confidence: 98,
      tags: ['Duplicate', 'Contract'],
      isDuplicate: true,
      isPrivileged: false,
      fileType: 'document',
      metadata: {
        author: 'John Smith',
        created: '2024-03-15',
        pages: 12
      }
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState<'all' | 'ready' | 'flagged' | 'processing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAISettings, setShowAISettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleFileUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate file upload and AI processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === 'all' || file.status === filter;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: files.length,
    processed: files.filter(f => f.status === 'ready').length,
    flagged: files.filter(f => f.status === 'flagged').length,
    privileged: files.filter(f => f.isPrivileged).length,
    duplicates: files.filter(f => f.isDuplicate).length
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'email': return Mail;
      default: return FileText;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1>Discovery Manager</h1>
          <p className="text-[#36454F]/70 mt-2">AI-powered organization of incoming discovery files</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGuide(true)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            How It Works
          </button>
          <button 
            onClick={handleFileUpload}
            disabled={isProcessing}
            className="btn btn-outline-gray flex items-center gap-2 shadow-lg"
          >
            <Upload className="w-4 h-4" />
            {isProcessing ? 'Processing...' : 'Upload Discovery'}
          </button>
        </div>
      </div>

      {/* Integration Guide Modal */}
      {showGuide && <DiscoveryIntegrationGuide onClose={() => setShowGuide(false)} />}

      {/* AI Settings Panel */}
      {showAISettings && (
        <div className="glass-card p-4 md:p-6 mb-6">
          <h3 className="mb-4">AI Automation Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B76E79]" />
              <div>
                <p className="text-sm">Auto-categorization</p>
                <p className="text-xs text-[#36454F]/60">Automatically classify documents by type</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B76E79]" />
              <div>
                <p className="text-sm">Privilege Detection</p>
                <p className="text-xs text-[#36454F]/60">Flag attorney-client communications</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B76E79]" />
              <div>
                <p className="text-sm">Duplicate Detection</p>
                <p className="text-xs text-[#36454F]/60">Identify and flag duplicate files</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B76E79]" />
              <div>
                <p className="text-sm">OCR Text Extraction</p>
                <p className="text-xs text-[#36454F]/60">Extract text from images and PDFs</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B76E79]" />
              <div>
                <p className="text-sm">Auto-tagging</p>
                <p className="text-xs text-[#36454F]/60">Generate relevant tags automatically</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B76E79]" />
              <div>
                <p className="text-sm">Smart Bates Numbering</p>
                <p className="text-xs text-[#36454F]/60">Auto-assign sequential Bates numbers</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isProcessing && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin">
              <Zap className="w-5 h-5 text-[#B76E79]" />
            </div>
            <h3>AI Processing Discovery Files...</h3>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#B76E79] to-[#8B4B56] transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-[#36454F]/70">
              <span>Analyzing content, detecting duplicates, extracting metadata...</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FolderOpen className="w-4 h-4 md:w-5 md:h-5 text-[#B76E79]" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Total Files</p>
          </div>
          <p className="text-2xl md:text-3xl text-[#B76E79]">{stats.total}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Processed</p>
          </div>
          <p className="text-2xl md:text-3xl text-green-600">{stats.processed}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Flagged</p>
          </div>
          <p className="text-2xl md:text-3xl text-orange-600">{stats.flagged}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Privileged</p>
          </div>
          <p className="text-2xl md:text-3xl text-red-600">{stats.privileged}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Copy className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <p className="text-xs md:text-sm text-[#36454F]/70">Duplicates</p>
          </div>
          <p className="text-2xl md:text-3xl text-blue-600">{stats.duplicates}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#36454F]/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search files, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[#36454F] placeholder-[#36454F]/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'ready', 'flagged', 'processing'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`pill-button text-sm whitespace-nowrap ${
                  filter === f
                    ? 'bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white'
                    : 'bg-white/40 text-[#36454F] hover:bg-white/60'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-2xl">Discovery Files</h2>
          <div className="flex gap-2">
            <button className="pill-button bg-white/60 text-[#36454F] text-sm flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <span className="hidden sm:inline">Sort</span>
            </button>
            <button className="pill-button bg-white/60 text-[#36454F] text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export All</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.fileType);
            
            return (
              <div key={file.id} className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-all">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* File Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B76E79] to-[#8B4B56] flex items-center justify-center flex-shrink-0">
                        <FileIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-sm md:text-base break-all">{file.name}</h3>
                          {file.batesNumber && (
                            <span className="px-2 py-1 bg-[#B76E79]/20 text-[#B76E79] rounded-full text-xs whitespace-nowrap">
                              {file.batesNumber}
                            </span>
                          )}
                          {file.status === 'processing' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Processing
                            </span>
                          )}
                          {file.isPrivileged && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Privileged
                            </span>
                          )}
                          {file.isDuplicate && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center gap-1">
                              <Copy className="w-3 h-3" />
                              Duplicate
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-[#36454F]/60 mb-2">
                          <span>{file.size}</span>
                          <span>{file.uploadedDate}</span>
                          {file.metadata.pages && <span>{file.metadata.pages} pages</span>}
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="pl-0 lg:pl-13">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#B76E79]" />
                        <span className="text-sm">AI Category: <strong>{file.aiCategory}</strong></span>
                        <span className="text-xs text-[#36454F]/60">({file.confidence}% confidence)</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {file.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/80 rounded text-xs flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      {file.metadata.author && (
                        <p className="text-xs text-[#36454F]/60">
                          Author: {file.metadata.author} • Created: {file.metadata.created}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 justify-end">
                    <button className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F] text-xs flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F] text-xs flex items-center gap-2">
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F] text-xs flex items-center gap-2">
                      <FileCheck className="w-3 h-3" />
                      <span className="hidden sm:inline">Review</span>
                    </button>
                    <button className="pill-button bg-red-100 hover:bg-red-200 text-red-600 text-xs flex items-center gap-2">
                      <Trash2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B76E79]" />
            AI Insights
          </h3>
          <div className="space-y-2 text-sm text-[#36454F]/70">
            <p>• 2 privileged documents detected</p>
            <p>• 1 duplicate file identified</p>
            <p>• 87% categorization accuracy</p>
            <p>• 156 tags auto-generated</p>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm mb-3">Recent Activity</h3>
          <div className="space-y-2 text-sm text-[#36454F]/70">
            <p>• Processed 5 new files</p>
            <p>• OCR completed on 3 documents</p>
            <p>• Applied Bates numbering</p>
            <p>• Generated metadata</p>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#36454F]/70">Processing Time</span>
              <span className="text-[#B76E79]">2.3 sec/file</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#36454F]/70">Storage Used</span>
              <span className="text-[#B76E79]">8.9 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#36454F]/70">Time Saved</span>
              <span className="text-[#B76E79]">4.2 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}