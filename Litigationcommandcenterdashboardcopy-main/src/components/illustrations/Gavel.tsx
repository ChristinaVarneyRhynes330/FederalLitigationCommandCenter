interface GavelProps {
  size?: number;
  className?: string;
}

export function Gavel({ size = 120, className = '' }: GavelProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sound block */}
      <rect x="15" y="85" width="35" height="12" rx="3" fill="url(#gavelGradient1)" />
      
      {/* Gavel handle */}
      <rect 
        x="45" 
        y="25" 
        width="50" 
        height="8" 
        rx="4" 
        fill="url(#gavelGradient2)"
        transform="rotate(45 70 29)"
      />
      
      {/* Gavel head */}
      <rect 
        x="60" 
        y="15" 
        width="25" 
        height="12" 
        rx="3" 
        fill="url(#gavelGradient3)"
        transform="rotate(45 72.5 21)"
      />
      
      {/* Impact lines */}
      <line x1="25" y1="75" x2="30" y2="70" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="35" y1="75" x2="40" y2="70" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="45" y1="75" x2="50" y2="70" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      
      <defs>
        <linearGradient id="gavelGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <linearGradient id="gavelGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4757" />
          <stop offset="100%" stopColor="#6B3544" />
        </linearGradient>
        <linearGradient id="gavelGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9F5166" />
          <stop offset="100%" stopColor="#8B4757" />
        </linearGradient>
      </defs>
    </svg>
  );
}
