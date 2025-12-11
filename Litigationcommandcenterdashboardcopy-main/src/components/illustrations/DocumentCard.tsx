interface DocumentCardProps {
  type?: 'pdf' | 'image' | 'video' | 'audio' | 'document';
  size?: number;
  className?: string;
}

export function DocumentCard({ type = 'document', size = 80, className = '' }: DocumentCardProps) {
  const typeColors = {
    pdf: { primary: '#DC2626', secondary: '#EF4444', bg: '#FEE2E2' },
    image: { primary: '#7C3AED', secondary: '#A78BFA', bg: '#EDE9FE' },
    video: { primary: '#2563EB', secondary: '#60A5FA', bg: '#DBEAFE' },
    audio: { primary: '#059669', secondary: '#34D399', bg: '#D1FAE5' },
    document: { primary: '#1E3A5F', secondary: '#4A6FA5', bg: '#DBEAFE' }
  };

  const colors = typeColors[type];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shadow */}
      <rect x="12" y="18" width="50" height="62" rx="4" fill="black" opacity="0.05" />
      
      {/* Main document */}
      <rect x="10" y="15" width="50" height="62" rx="4" fill="white" stroke={colors.primary} strokeWidth="2" />
      
      {/* Corner fold */}
      <path d="M 60 15 L 60 28 L 47 28 Z" fill={colors.bg} stroke={colors.primary} strokeWidth="1.5" />
      
      {/* Type-specific icon in center */}
      {type === 'pdf' && (
        <>
          <text x="35" y="48" textAnchor="middle" fontSize="16" fontWeight="bold" fill={colors.primary}>PDF</text>
        </>
      )}
      
      {type === 'image' && (
        <>
          <rect x="20" y="35" width="30" height="25" rx="2" fill={colors.bg} stroke={colors.primary} strokeWidth="1.5" />
          <circle cx="27" cy="43" r="3" fill={colors.secondary} />
          <path d="M 22 55 L 30 47 L 38 55" stroke={colors.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      
      {type === 'video' && (
        <>
          <rect x="20" y="35" width="30" height="25" rx="2" fill={colors.bg} stroke={colors.primary} strokeWidth="1.5" />
          <path d="M 30 43 L 30 53 L 40 48 Z" fill={colors.primary} />
        </>
      )}
      
      {type === 'audio' && (
        <>
          <circle cx="35" cy="47" r="12" fill={colors.bg} stroke={colors.primary} strokeWidth="1.5" />
          <path d="M 30 47 L 35 42 L 35 52 Z" fill={colors.primary} />
          <path d="M 39 42 Q 44 47 39 52" stroke={colors.primary} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      
      {type === 'document' && (
        <>
          <line x1="18" y1="30" x2="52" y2="30" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="38" x2="48" y2="38" stroke={colors.secondary} strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="46" x2="52" y2="46" stroke={colors.secondary} strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="54" x2="45" y2="54" stroke={colors.secondary} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
