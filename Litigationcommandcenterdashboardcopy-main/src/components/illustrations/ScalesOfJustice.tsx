interface ScalesOfJusticeProps {
  size?: number;
  className?: string;
}

export function ScalesOfJustice({ size = 200, className = '' }: ScalesOfJusticeProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base */}
      <rect x="70" y="170" width="60" height="8" rx="4" fill="url(#gradient1)" />
      
      {/* Central pole */}
      <rect x="97" y="40" width="6" height="130" rx="3" fill="url(#gradient2)" />
      
      {/* Crossbar */}
      <rect x="40" y="60" width="120" height="5" rx="2.5" fill="url(#gradient2)" />
      
      {/* Left chain */}
      <line x1="60" y1="63" x2="60" y2="100" stroke="#4B5563" strokeWidth="2" />
      
      {/* Right chain */}
      <line x1="140" y1="63" x2="140" y2="100" stroke="#4B5563" strokeWidth="2" />
      
      {/* Left scale pan */}
      <ellipse cx="60" cy="102" rx="25" ry="4" fill="url(#gradient3)" />
      <path d="M 35 102 L 35 110 Q 35 115 40 115 L 80 115 Q 85 115 85 110 L 85 102" 
            fill="url(#gradient4)" stroke="#375A8F" strokeWidth="1.5" />
      
      {/* Right scale pan */}
      <ellipse cx="140" cy="102" rx="25" ry="4" fill="url(#gradient3)" />
      <path d="M 115 102 L 115 110 Q 115 115 120 115 L 160 115 Q 165 115 165 110 L 165 102" 
            fill="url(#gradient4)" stroke="#375A8F" strokeWidth="1.5" />
      
      {/* Top decoration */}
      <circle cx="100" cy="35" r="8" fill="url(#gradient5)" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9F5166" />
          <stop offset="100%" stopColor="#8B4757" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#D1D5DB" />
        </linearGradient>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="gradient5" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
