import { 
  LayoutDashboard, 
  FolderOpen, 
  Bot, 
  Truck, 
  Gavel, 
  DollarSign, 
  BookOpen,
  Scale,
  Upload,
  BookMarked
} from 'lucide-react';

type View = 'dashboard' | 'evidence' | 'ai-team' | 'logistics' | 'hearing' | 'finance' | 'library' | 'discovery' | 'binder';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'evidence' as View, label: 'Evidence Vault', icon: FolderOpen },
  { id: 'ai-team' as View, label: 'AI Legal Team', icon: Bot },
  { id: 'logistics' as View, label: 'Logistics', icon: Truck },
  { id: 'hearing' as View, label: 'Hearing Mode', icon: Gavel },
  { id: 'finance' as View, label: 'Finance', icon: DollarSign },
  { id: 'library' as View, label: 'Law Library', icon: BookOpen },
  { id: 'discovery' as View, label: 'Discovery', icon: Upload },
  { id: 'binder' as View, label: 'The Binder', icon: BookMarked },
];

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col" style={{ boxShadow: 'var(--elevation-1)' }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ 
            background: 'linear-gradient(135deg, #9F5166 0%, #8B4757 100%)',
            boxShadow: '0 4px 12px rgba(159, 81, 102, 0.3)'
          }}>
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">Litigation Command</h2>
            <p className="text-xs text-gray-600">v2.4.1</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Win Rate</span>
            <span className="font-semibold text-gray-900">94%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Cases</span>
            <span className="font-semibold text-gray-900">127</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Active</span>
            <span className="font-semibold text-gray-900">8</span>
          </div>
        </div>
      </div>
    </aside>
  );
}