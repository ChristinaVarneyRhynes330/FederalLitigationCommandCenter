import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { EvidenceVault } from './components/EvidenceVault';
import { AILegalTeamEnhanced } from './components/AILegalTeamEnhanced';
import { Logistics } from './components/Logistics';
import { HearingMode } from './components/HearingMode';
import { Finance } from './components/Finance';
import { LawLibrary } from './components/LawLibrary';
import { DiscoveryManager as Discovery } from './components/DiscoveryManager';
import { Binder } from './components/Binder';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { MobileNav } from './components/MobileNav';
import { callGemini, AI_PROMPTS } from './utils/gemini';

type View = 'landing' | 'dashboard' | 'evidence' | 'ai-team' | 'logistics' | 'hearing' | 'finance' | 'library' | 'discovery' | 'binder';

interface Evidence {
  batesNumber: string;
  description: string;
  date: string;
  type: string;
  tags?: string[];
}

interface AppState {
  apiKey: string;
  batesPrefix: string;
  batesCounter: number;
  evidence: Evidence[];
}

const STORAGE_KEY = 'litigation_command_center_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Load state from localStorage
  const [state, setState] = useState<AppState>(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const envApiKey = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_GEMINI_API_KEY 
    ? import.meta.env.VITE_GEMINI_API_KEY 
    : '';
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        apiKey: envApiKey || parsed.apiKey || ''
      };
    } catch (e) {
      console.error('Failed to parse stored state:', e);
    }
  }
  return {
    apiKey: envApiKey,
    batesPrefix: 'PLTF',
    batesCounter: 1,
    evidence: []
  };
});
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleSaveSettings = (apiKey: string, batesPrefix: string) => {
    setState(prev => ({ ...prev, apiKey, batesPrefix }));
  };

  const handleClearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const handleAddEvidence = (evidence: Omit<Evidence, 'batesNumber'>) => {
    const batesNumber = `${state.batesPrefix}-${String(state.batesCounter).padStart(3, '0')}`;
    setState(prev => ({
      ...prev,
      batesCounter: prev.batesCounter + 1,
      evidence: [...prev.evidence, { ...evidence, batesNumber }]
    }));
  };

  const handleEmergencyGuidance = async (scenario: string): Promise<string> => {
    const prompts: Record<string, string> = {
      missed_deadline: 'An attorney just realized they missed a critical filing deadline. Provide immediate emergency triage: 1) Immediate actions (next 24 hours), 2) Risk assessment, 3) Damage control strategies (motion for extension, excusable neglect under FRCP 6(b)), 4) Long-term remediation.',
      motion_dismiss: 'Opposing counsel just filed a motion to dismiss. Provide: 1) Immediate response timeline (typically 21 days under FRCP 12), 2) Key arguments to address, 3) Evidence to marshal, 4) Strategic considerations (amend complaint vs. oppose motion).',
      conferral_fail: 'Good faith conferral under FRCP 26(f) or local meet-and-confer rules failed. Provide: 1) Documentation requirements, 2) How to demonstrate good faith effort, 3) Next steps (file motion with certificate of conferral), 4) Protecting the record.'
    };

    const prompt = prompts[scenario] || 'Provide emergency litigation guidance.';
    
    try {
      return await callGemini(prompt, AI_PROMPTS.emergency, state.apiKey);
    } catch (error) {
      throw error;
    }
  };

  const handleSimulateJudge = async (script: string): Promise<string> => {
    const prompt = `Review this attorney's oral argument and generate 5-7 tough questions a federal judge would ask:\n\n${script}`;
    
    try {
      return await callGemini(prompt, AI_PROMPTS.judge, state.apiKey);
    } catch (error) {
      throw error;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onEnter={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'evidence':
        return <EvidenceVault onAddEvidence={handleAddEvidence} />;
      case 'ai-team':
        return <AILegalTeamEnhanced apiKey={state.apiKey} />;
      case 'logistics':
        return <Logistics />;
      case 'finance':
        return <Finance />;
      case 'library':
        return <LawLibrary apiKey={state.apiKey} />;
      case 'discovery':
        return <Discovery />;
      case 'binder':
        return <Binder evidence={state.evidence} />;
      default:
        return <Dashboard />;
    }
  };

  if (currentView === 'landing') {
    return <>{renderView()}</>;
  }

  if (currentView === 'hearing') {
    return (
      <div className="min-h-screen bg-gradient-navy">
        <HearingMode 
          onExit={() => setCurrentView('dashboard')}
          onSimulateJudge={handleSimulateJudge}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav 
          currentView={currentView} 
          onNavigate={(view) => {
            setCurrentView(view);
            setIsMobileMenuOpen(false);
          }}
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderView()}
      </main>

      {/* Settings Button - Fixed position */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 md:top-8 md:right-8 btn btn-sm btn-ghost flex items-center gap-2 z-30 bg-white"
        style={{ boxShadow: 'var(--elevation-2)' }}
        aria-label="Settings"
      >
        <SettingsIcon className="w-4 h-4" />
        <span className="hidden md:inline">Settings</span>
      </button>

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={state.apiKey}
        batesPrefix={state.batesPrefix}
        onSave={handleSaveSettings}
        onClearData={handleClearData}
      />
    </div>
  );
}