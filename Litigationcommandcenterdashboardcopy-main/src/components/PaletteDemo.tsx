import { Sparkles, Palette, X } from 'lucide-react';

interface PaletteDemoProps {
  onClose: () => void;
}

export function PaletteDemo({ onClose }: PaletteDemoProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-teal" />
            <h2 className="text-3xl">Color Palette In Action</h2>
          </div>
          <button onClick={onClose} className="pill-button bg-white/60 hover:bg-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[#36454F]/70 mb-8">
          See how the unified luxury palette creates visual harmony throughout your application.
        </p>

        {/* Gradient Showcase */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl">Signature Gradients</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="gradient-luxury h-32 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">Luxury Flow</span>
            </div>
            <div className="gradient-teal h-32 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">Teal Elegance</span>
            </div>
            <div className="bg-gradient-to-r from-[#B76E79] to-[#8B4B56] h-32 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">Rose Signature</span>
            </div>
            <div className="bg-gradient-to-r from-[#FDFBF7] via-[#FCE4EC] to-[#E7D8C5] h-32 rounded-xl flex items-center justify-center border-2 border-[#E7D8C5]">
              <span className="bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm text-[#36454F]">Warm Embrace</span>
            </div>
          </div>
        </div>

        {/* Glass Card Variations */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl">Glass Card Variations</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B76E79] to-[#8B4B56] mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Default Glass</p>
              <p className="text-xs text-[#36454F]/60 mt-1">White/Warm Base</p>
            </div>
            <div className="glass-card-teal p-6 text-center border border-teal/30">
              <div className="w-12 h-12 rounded-full gradient-teal mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Teal Glass</p>
              <p className="text-xs text-[#36454F]/60 mt-1">Mint Whisper</p>
            </div>
            <div className="glass-card-sage p-6 text-center border border-sage/30">
              <div className="w-12 h-12 rounded-full bg-sage mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Sage Glass</p>
              <p className="text-xs text-[#36454F]/60 mt-1">Soft Green</p>
            </div>
          </div>
        </div>

        {/* Button Variations */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl">Button Styles</h3>
          <div className="flex flex-wrap gap-4">
            <button className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white shadow-lg shadow-rose-gold/30">
              Rose Gold Primary
            </button>
            <button className="pill-button gradient-teal text-white shadow-lg shadow-teal/30">
              Teal Primary
            </button>
            <button className="pill-button bg-sage text-white">
              Sage Action
            </button>
            <button className="pill-button bg-white/60 text-[#36454F] hover:bg-white/80 border border-teal/20">
              Secondary Teal
            </button>
            <button className="pill-button bg-white/60 text-[#36454F] hover:bg-white/80">
              Default Secondary
            </button>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="space-y-6">
          <h3 className="text-xl">Color Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            <div>
              <div className="h-20 rounded-lg bg-[#FDFBF7] border-2 border-[#E7D8C5] mb-2"></div>
              <p className="text-xs">Ivory</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#F8F6F1] border-2 border-[#E7D8C5] mb-2"></div>
              <p className="text-xs">Cream</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#E7D8C5] mb-2"></div>
              <p className="text-xs">Warm Beige</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#C8BDB0] mb-2"></div>
              <p className="text-xs">Taupe</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#B6AFA4] mb-2"></div>
              <p className="text-xs">Warm Gray</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#E1EAE5] border-2 border-[#A7D7B8] mb-2"></div>
              <p className="text-xs">Mint Whisper</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#A7D7B8] mb-2"></div>
              <p className="text-xs">Sage</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#66B2A0] mb-2"></div>
              <p className="text-xs text-white pt-2">Teal</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#4E796B] mb-2"></div>
              <p className="text-xs text-white pt-2">Deep Teal</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#2C3E3E] mb-2"></div>
              <p className="text-xs text-white pt-2">Teal Noir</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#FCE4EC] border-2 border-[#B76E79] mb-2"></div>
              <p className="text-xs">Blush</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#F5E8EC] border-2 border-[#B76E79] mb-2"></div>
              <p className="text-xs">Rose Mist</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#B76E79] mb-2"></div>
              <p className="text-xs text-white pt-2">Rose Gold</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#8B4B56] mb-2"></div>
              <p className="text-xs text-white pt-2">Deep Rose</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-[#36454F] mb-2"></div>
              <p className="text-xs text-white pt-2">Charcoal</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E1EAE5] flex justify-end">
          <button onClick={onClose} className="pill-button gradient-teal text-white">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
