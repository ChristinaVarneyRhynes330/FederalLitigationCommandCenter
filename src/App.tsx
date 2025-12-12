import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Settings } from './components/Settings';
import { MobileNav } from './components/MobileNav';

// --- FIXED IMPORTS BASED ON YOUR LOGS ---

// Error TS2614 means these use "export default", so NO curly braces:
import Dashboard from './components/Dashboard';
import EvidenceVault from './components/EvidenceVault';
import HearingMode from './components/HearingMode';

// Error TS2613 means these use "export const", so USE curly braces:
import { AILegalTeam } from './components/AILegalTeam';
import { LawLibrary } from './components/LawLibrary';

export type View = 'dashboard' | 'evidence' | 'ai-team' | 'logistics' | 'hearing' | 'finance' | 'library' | 'discovery' | 'binder';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
    const [batesPrefix, setBatesPrefix] = useState('DEF-');

    // Handlers
    const handleSaveSettings = (newApiKey: string, newBatesPrefix: string) => {
        setApiKey(newApiKey);
        setBatesPrefix(newBatesPrefix);
        localStorage.setItem('gemini_api_key', newApiKey);
        localStorage.setItem('bates_prefix', newBatesPrefix);
    };

    const handleClearData = () => {
        setApiKey('');
        setBatesPrefix('DEF-');
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('bates_prefix');
        alert("Application data reset.");
    };

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        const savedPrefix = localStorage.getItem('bates_prefix');
        if (savedKey) setApiKey(savedKey);
        if (savedPrefix) setBatesPrefix(savedPrefix);
    }, []);

    if (!isLoggedIn) {
        return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                // We use a wrapper function here to fix the "Type string is not assignable to View" error
                return <Dashboard onNavigate={(view: any) => setCurrentView(view)} />;
            case 'evidence':
                return <EvidenceVault />;
            case 'ai-team':
                // Passes apiKey as required by your error logs
                return <AILegalTeam apiKey={apiKey} />;
            case 'hearing':
                // Passes onExit as required by your error logs
                return <HearingMode onExit={() => setCurrentView('dashboard')} />;
            case 'library':
                return <LawLibrary apiKey={apiKey} />;
            default:
                return <div className="p-8">View under construction: {currentView}</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            <div className="hidden md:block">
                <Sidebar activeView={currentView} onViewChange={setCurrentView} />
            </div>

            <div className="md:hidden">
                <MobileNav
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                    activeView={currentView}
                    onViewChange={(view: any) => {
                        setCurrentView(view);
                        setIsMobileMenuOpen(false);
                    }}
                />
            </div>

            <main className="flex-1 overflow-auto relative">
                {renderView()}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 z-40"
                >
                    ⚙️
                </button>
            </main>

            <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                apiKey={apiKey}
                batesPrefix={batesPrefix}
                onSave={handleSaveSettings}
                onClearData={handleClearData}
            />
        </div>
    );
}

export default App;