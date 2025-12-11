import { 
  LayoutDashboard, 
  FolderOpen, 
  Bot, 
  Truck, 
  Gavel, 
  DollarSign, 
  Users, 
  BookOpen,
  Menu,
  X,
  Scale,
  Upload,
  BookMarked
} from 'lucide-react';

type View = 'dashboard' | 'evidence' | 'ai-team' | 'logistics' | 'hearing' | 'finance' | 'people' | 'library' | 'discovery' | 'binder';

interface MobileNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'evidence' as View, label: 'Evidence Vault', icon: FolderOpen },
  { id: 'ai-team' as View, label: 'AI Legal Team', icon: Bot },
  { id: 'logistics' as View, label: 'Logistics', icon: Truck },
  { id: 'hearing' as View, label: 'Hearing Mode', icon: Gavel },
  { id: 'finance' as View, label: 'Finance', icon: DollarSign },
  { id: 'people' as View, label: 'People', icon: Users },
  { id: 'library' as View, label: 'Law Library', icon: BookOpen },
  { id: 'discovery' as View, label: 'Discovery', icon: Upload },
  { id: 'binder' as View, label: 'The Binder', icon: BookMarked },
];

export function MobileNav({ currentView, onNavigate, isOpen, onToggle }: MobileNavProps) {
  const currentItem = navItems.find(item => item.id === currentView);
  const CurrentIcon = currentItem?.icon || LayoutDashboard;

  return (
    <>
      {/* Mobile Header */}
      <div className="glass-card m-2 p-4 flex items-center justify-between sticky top-2 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B76E79] to-[#8B4B56] flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm">Command Center</h3>
            <p className="text-xs text-[#36454F]/60">{currentItem?.label}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-10 h-10 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={onToggle}>
          <div 
            className="glass-card m-4 mt-20 p-6 max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`pill-button w-full text-left flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white shadow-md'
                        : 'bg-white/40 text-[#36454F]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}