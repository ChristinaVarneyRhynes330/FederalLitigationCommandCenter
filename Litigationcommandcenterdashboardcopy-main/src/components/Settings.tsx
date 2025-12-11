import { useState } from 'react';
import { Settings as SettingsIcon, Key, Tag, Trash2, X, Save } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  batesPrefix: string;
  onSave: (apiKey: string, batesPrefix: string) => void;
  onClearData: () => void;
}

export function Settings({ 
  isOpen, 
  onClose, 
  apiKey, 
  batesPrefix, 
  onSave,
  onClearData 
}: SettingsProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localBatesPrefix, setLocalBatesPrefix] = useState(batesPrefix);
  const [showApiKey, setShowApiKey] = useState(false);
  const hasEnvApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localApiKey, localBatesPrefix);
    onClose();
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ This will reset ALL your data including evidence, chat history, and settings. Are you sure?')) {
      onClearData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-teal/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl">Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="pill-button bg-white/60 hover:bg-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* API Key Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-teal" />
              <label className="text-sm uppercase tracking-wider text-[#36454F]/70">
                Gemini API Key
              </label>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E1EAE5] focus:border-teal focus:outline-none bg-white/60 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#36454F]/50 hover:text-teal"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-[#36454F]/60 mt-2">
              Get your free API key from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                Google AI Studio
              </a>
            </p>
            {hasEnvApiKey && (
              <div className="mt-2 flex items-start gap-2 text-xs text-teal">
                <span className="mt-0.5">✓</span>
                <span>API key loaded from environment variable (configured in deployment)</span>
              </div>
            )}
          </div>

          {/* Bates Prefix Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-[#B76E79]" />
              <label className="text-sm uppercase tracking-wider text-[#36454F]/70">
                Bates Prefix
              </label>
            </div>
            <input
              type="text"
              value={localBatesPrefix}
              onChange={(e) => setLocalBatesPrefix(e.target.value.toUpperCase())}
              placeholder="PLTF"
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E1EAE5] focus:border-[#B76E79] focus:outline-none bg-white/60 font-mono"
            />
            <p className="text-xs text-[#36454F]/60 mt-2">
              Example: <span className="font-mono">{localBatesPrefix || 'PLTF'}-001</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="glass-card-teal p-4 border border-teal/30">
            <p className="text-sm text-[#36454F]/80">
              <strong className="text-teal">💡 Privacy Note:</strong> Your API key is stored locally in your browser and never sent to our servers. All AI requests go directly from your browser to Google's Gemini API.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-[#36454F]/10">
            <h3 className="text-sm uppercase tracking-wider text-red-600 mb-3">Danger Zone</h3>
            <button
              onClick={handleClearData}
              className="pill-button bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
            <p className="text-xs text-[#36454F]/60 mt-2">
              This will permanently delete all evidence, chat history, and settings.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-teal/20">
          <button
            onClick={onClose}
            className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F] flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="pill-button gradient-teal text-white flex-1 flex items-center justify-center gap-2 shadow-lg shadow-teal/30"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}