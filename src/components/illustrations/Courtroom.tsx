interface CourtroomProps {
  size?: number;
  className?: string;
}

export function Courtroom({ size = 300, className = '' }: CourtroomProps) {
  return (
    <svg 
      width={size} 
      height={size * 0.6} 
      viewBox="0 0 300 180" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Judge's bench - elevated */}
      <rect x="100" y="30" width="100" height="40" rx="4" fill="url(#benchGradient)" />
      <rect x="95" y="65" width="110" height="8" rx="2" fill="#6B4423" />
      
      {/* Gavel on bench */}
      <rect x="175" y="50" width="15" height="4" rx="2" fill="#8B4757" />
      <rect x="180" y="46" width="5" height="8" rx="2" fill="#9F5166" />
      
      {/* Seal/emblem behind bench */}
      <circle cx="150" cy="20" r="12" fill="url(#sealGradient)" />
      <circle cx="150" cy="20" r="8" fill="none" stroke="#C5A572" strokeWidth="1.5" />
      <path d="M 150 15 L 152 20 L 150 25 L 148 20 Z" fill="#C5A572" />
      
      {/* Tables */}
      {/* Left table (prosecution/plaintiff) */}
      <rect x="20" y="100" width="80" height="50" rx="3" fill="url(#tableGradient)" />
      <rect x="18" y="145" width="84" height="6" rx="2" fill="#4A6FA5" opacity="0.7" />
      
      {/* Right table (defense) */}
      <rect x="200" y="100" width="80" height="50" rx="3" fill="url(#tableGradient)" />
      <rect x="198" y="145" width="84" height="6" rx="2" fill="#4A6FA5" opacity="0.7" />
      
      {/* People silhouettes */}
      {/* Judge */}
      <circle cx="150" cy="48" r="6" fill="#1E3A5F" />
      <rect x="144" y="53" width="12" height="15" rx="2" fill="#1E3A5F" />
      
      {/* Lawyer left */}
      <circle cx="50" cy="90" r="5" fill="#9F5166" />
      <rect x="45" y="94" width="10" height="12" rx="2" fill="#9F5166" />
      
      {/* Lawyer right */}
      <circle cx="240" cy="90" r="5" fill="#0D9488" />
      <rect x="235" y="94" width="10" height="12" rx="2" fill="#0D9488" />
      
      {/* Witness stand */}
      <rect x="130" y="110" width="40" height="35" rx="3" fill="url(#witnessGradient)" />
      <rect x="128" y="142" width="44" height="5" rx="2" fill="#6B4423" />
      
      {/* Floor lines for perspective */}
      <line x1="0" y1="155" x2="300" y2="155" stroke="#D1D5DB" strokeWidth="1" />
      <line x1="0" y1="165" x2="300" y2="165" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="0" y1="175" x2="300" y2="175" stroke="#F3F4F6" strokeWidth="1" />
      
      <defs>
        <linearGradient id="benchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B6F47" />
          <stop offset="100%" stopColor="#6B4423" />
        </linearGradient>
        <linearGradient id="tableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#375A8F" />
          <stop offset="100%" stopColor="#2B4C7E" />
        </linearGradient>
        <linearGradient id="witnessGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A6FA5" />
          <stop offset="100%" stopColor="#375A8F" />
        </linearGradient>
        <linearGradient id="sealGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#C5A572" />
        </linearGradient>
      </defs>
    </svg>
  );
}
