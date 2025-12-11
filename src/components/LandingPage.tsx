import { Scale, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { ColorPaletteShowcase } from './ColorPaletteShowcase';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [showPalette, setShowPalette] = useState(false);

  const features = [
    'Real-time docket clock and deadline tracking',
    'AI-powered legal research and analysis',
    'Comprehensive evidence management with Bates stamping',
    'Integrated conferral and logistics tracking',
    'Collaborative case planning tools',
    'Secure document vault with encryption'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-xl mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-gray-900 mb-4">
            Litigation Command Center
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Enterprise-grade legal case management platform. Streamline litigation workflows, 
            collaborate with AI legal assistants, and maintain complete oversight from discovery through trial.
          </p>
          
          <button
            onClick={onEnter}
            className="btn btn-primary"
          >
            Access Application
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6 mb-16">
          <div className="card">
            <div className="card-body">
              <h3 className="text-gray-900 mb-3">Case Management</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive deadline tracking, task management, and case timeline visualization. 
                Never miss a critical filing deadline.
              </p>
              <div className="flex items-center gap-2 text-sm text-teal">
                <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                Real-time updates
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-gray-900 mb-3">AI Legal Team</h3>
              <p className="text-gray-600 mb-4">
                Access specialized AI assistants for case strategy, legal research, motion drafting, 
                and cross-examination preparation.
              </p>
              <div className="flex items-center gap-2 text-sm text-teal">
                <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                8 specialized assistants
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-gray-900 mb-3">Evidence Vault</h3>
              <p className="text-gray-600 mb-4">
                Organized document repository with Bates stamping, metadata tagging, and advanced 
                search capabilities.
              </p>
              <div className="flex items-center gap-2 text-sm text-teal">
                <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                Secure & encrypted
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-gray-900 mb-3">Collaboration Tools</h3>
              <p className="text-gray-600 mb-4">
                Integrated conferral logging, hearing mode, and team coordination features for 
                seamless litigation management.
              </p>
              <div className="flex items-center gap-2 text-sm text-teal">
                <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                Multi-user support
              </div>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-gray-900">Platform Capabilities</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-teal" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">
            Trusted by legal professionals nationwide
          </p>
          <button
            onClick={() => setShowPalette(true)}
            className="btn btn-sm btn-ghost"
          >
            View Design System
          </button>
        </div>
        
        {showPalette && <ColorPaletteShowcase onClose={() => setShowPalette(false)} />}
      </div>
    </div>
  );
}
