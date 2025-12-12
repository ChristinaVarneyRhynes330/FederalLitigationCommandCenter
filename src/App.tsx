import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import EvidenceVault from './components/EvidenceVault';
import DiscoveryManager from './components/DiscoveryManager';
import People from './components/People';
import Finance from './components/Finance';
import Logistics from './components/Logistics';
import Binder from './components/Binder';
import HearingMode from './components/HearingMode';
import LawLibrary from './components/LawLibrary';
import { AILegalTeamEnhanced } from './components/AILegalTeamEnhanced'; // Updated to use Enhanced version
import { Settings } from './components/Settings';

export default function App() {
    const [session, setSession] = useState<any>(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. Check for active Supabase session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 2. Navigation Handler (Passed to Dashboard)
    const handleNavigate = (view: string) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    if (!session) {
        return <LandingPage onLogin={() => {}} />;
    }

    // 3. Render the correct page based on currentView
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                // Pass handleNavigate so buttons on Dashboard work!
                return <Dashboard onNavigate={handleNavigate} />;
            case 'evidence':
                return <EvidenceVault />;
            case 'discovery':
                return <DiscoveryManager />;
            case 'people':
                return <People />;
            case 'finance':
                return <Finance />;
            case 'logistics':
                return <Logistics />;
            case 'binder':
                return <Binder />;
            case 'hearing':
                // When exiting hearing mode, go back to dashboard
                return <HearingMode onExit={() => setCurrentView('dashboard')} />;
            case 'library':
                return <LawLibrary />;
            case 'ai-team':
                // Pass API key from env if available
                return <AILegalTeamEnhanced apiKey={import.meta.env.VITE_GEMINI_API_KEY || ''} />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F5F5F7]">
            {/* Sidebar Navigation */}
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar activeView={currentView} onViewChange={setCurrentView} />
            </div>

            <MobileNav
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                activeView={currentView}
                onViewChange={(view) => {
                    setCurrentView(view);
                    setIsMobileMenuOpen(false);
                }}
            />

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 flex flex-col h-full overflow-hidden">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Litigation Command</span>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-md">
                        ☰
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-slate-50">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}