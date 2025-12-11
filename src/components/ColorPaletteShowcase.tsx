import { X, Palette, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ShowcaseProps {
  onClose: () => void;
}

export function ColorPaletteShowcase({ onClose }: ShowcaseProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colorGroups = [
    {
      name: 'Warm Neutrals',
      description: 'Sophisticated foundation palette',
      colors: [
        { name: 'Ivory', hex: '#FDFBF7', var: '--color-ivory' },
        { name: 'Cream', hex: '#F8F6F1', var: '--color-cream' },
        { name: 'Warm Beige', hex: '#E7D8C5', var: '--color-warm-beige' },
        { name: 'Taupe', hex: '#C8BDB0', var: '--color-taupe' },
        { name: 'Warm Gray', hex: '#B6AFA4', var: '--color-warm-gray' },
      ]
    },
    {
      name: 'Signature Rose-Gold',
      description: 'Luxury warmth & femininity',
      colors: [
        { name: 'Rose Mist', hex: '#F5E8EC', var: '--color-rose-mist' },
        { name: 'Blush', hex: '#FCE4EC', var: '--color-blush' },
        { name: 'Rose Gold', hex: '#B76E79', var: '--color-rose-gold' },
        { name: 'Deep Rose', hex: '#8B4B56', var: '--color-deep-rose' },
      ]
    },
    {
      name: 'Sophisticated Teal & Sage',
      description: 'Modern professional accents',
      colors: [
        { name: 'Mint Whisper', hex: '#E1EAE5', var: '--color-mint-whisper' },
        { name: 'Sage', hex: '#A7D7B8', var: '--color-sage' },
        { name: 'Teal', hex: '#66B2A0', var: '--color-teal' },
        { name: 'Deep Teal', hex: '#4E796B', var: '--color-deep-teal' },
      ]
    },
    {
      name: 'Sophisticated Darks',
      description: 'Depth & contrast',
      colors: [
        { name: 'Slate Gray', hex: '#7D7D7D', var: '--color-slate-gray' },
        { name: 'Charcoal', hex: '#36454F', var: '--color-charcoal' },
        { name: 'Teal Noir', hex: '#2C3E3E', var: '--color-teal-noir' },
        { name: 'Deep Charcoal', hex: '#141414', var: '--color-deep-charcoal' },
        { name: 'Aubergine', hex: '#3D2944', var: '--color-aubergine' },
      ]
    }
  ];

  const gradients = [
    { name: 'Luxury Flow', css: 'linear-gradient(135deg, #FDFBF7 0%, #F8F6F1 25%, #E1EAE5 50%, #A7D7B8 75%, #66B2A0 100%)' },
    { name: 'Warm Embrace', css: 'linear-gradient(135deg, #FDFBF7 0%, #FCE4EC 50%, #E7D8C5 100%)' },
    { name: 'Teal Elegance', css: 'linear-gradient(135deg, #66B2A0 0%, #4E796B 100%)' },
    { name: 'Rose Signature', css: 'linear-gradient(135deg, #B76E79 0%, #8B4B56 100%)' },
    { name: 'Sophisticated Spectrum', css: 'linear-gradient(0.25turn, #F8F6F1, #E1EAE5, #A7D7B8, #66B2A0, #4E796B)' },
    { name: 'Neutral Refinement', css: 'linear-gradient(0.25turn, #FDFBF7, #E7D8C5, #B6AFA4, #7D7D7D, #36454F)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-6xl w-full my-8 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B76E79] via-[#66B2A0] to-[#4E796B] flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl">Unified Luxury Color Palette</h2>
              <p className="text-sm text-[#36454F]/70">Modern • Professional • Sophisticated • High-End</p>
            </div>
          </div>
          <button onClick={onClose} className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Philosophy */}
        <div className="glass-card p-5 mb-6 bg-gradient-to-r from-[#F8F6F1] to-[#E1EAE5]">
          <h3 className="mb-3">Color Philosophy</h3>
          <p className="text-sm text-[#36454F]/80 leading-relaxed">
            This unified palette merges warm, luxurious neutrals with sophisticated teal and sage accents, 
            anchored by your signature rose-gold tones. The combination creates a modern, professional aesthetic 
            that feels both calming and empowering - perfect for a high-end legal command center.
          </p>
        </div>

        {/* Color Groups */}
        <div className="space-y-6 mb-8">
          {colorGroups.map((group, idx) => (
            <div key={idx}>
              <div className="mb-3">
                <h3 className="text-lg">{group.name}</h3>
                <p className="text-sm text-[#36454F]/60">{group.description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {group.colors.map((color, colorIdx) => (
                  <div key={colorIdx} className="glass-card p-3 hover:scale-105 transition-transform cursor-pointer group">
                    <div 
                      className="h-20 rounded-lg mb-3 shadow-md"
                      style={{ backgroundColor: color.hex }}
                    />
                    <h4 className="text-sm mb-1">{color.name}</h4>
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-[#36454F]/60">{color.hex}</code>
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
                      >
                        {copiedColor === color.hex ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#36454F]/60" />
                        )}
                      </button>
                    </div>
                    <code className="text-xs text-[#36454F]/40 block mt-1">{color.var}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gradients */}
        <div className="mb-6">
          <h3 className="mb-3">Signature Gradients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gradients.map((gradient, idx) => (
              <div key={idx} className="glass-card p-4 hover:scale-105 transition-transform cursor-pointer group">
                <div 
                  className="h-24 rounded-lg mb-3 shadow-md"
                  style={{ background: gradient.css }}
                />
                <h4 className="text-sm mb-2">{gradient.name}</h4>
                <div className="flex items-start gap-2">
                  <code className="text-xs text-[#36454F]/60 flex-1 break-all">{gradient.css}</code>
                  <button
                    onClick={() => copyToClipboard(gradient.css)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded flex-shrink-0"
                  >
                    {copiedColor === gradient.css ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#36454F]/60" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 bg-gradient-to-br from-[#FDFBF7] to-[#E7D8C5]">
            <h4 className="mb-3">Primary Uses</h4>
            <ul className="text-sm space-y-2 text-[#36454F]/80">
              <li>• <strong>Backgrounds:</strong> Ivory, Cream, Warm Beige</li>
              <li>• <strong>Glass Cards:</strong> White with transparency</li>
              <li>• <strong>Text:</strong> Charcoal, Slate Gray</li>
            </ul>
          </div>

          <div className="glass-card p-4 bg-gradient-to-br from-[#FCE4EC] to-[#B76E79]">
            <h4 className="mb-3 text-white">Accent & Actions</h4>
            <ul className="text-sm space-y-2 text-white/90">
              <li>• <strong>CTAs:</strong> Rose Gold gradient</li>
              <li>• <strong>Highlights:</strong> Blush, Rose Mist</li>
              <li>• <strong>Active States:</strong> Deep Rose</li>
            </ul>
          </div>

          <div className="glass-card p-4 bg-gradient-to-br from-[#A7D7B8] to-[#4E796B]">
            <h4 className="mb-3 text-white">Professional Depth</h4>
            <ul className="text-sm space-y-2 text-white/90">
              <li>• <strong>Secondary CTAs:</strong> Teal gradient</li>
              <li>• <strong>Success States:</strong> Sage, Teal</li>
              <li>• <strong>Subtle Accents:</strong> Mint Whisper</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#B76E79]/20">
          <button 
            onClick={onClose} 
            className="pill-button bg-gradient-to-r from-[#B76E79] via-[#66B2A0] to-[#4E796B] text-white"
          >
            Apply Palette
          </button>
        </div>
      </div>
    </div>
  );
}
