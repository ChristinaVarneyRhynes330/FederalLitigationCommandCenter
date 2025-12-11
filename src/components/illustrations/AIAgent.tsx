interface AIAgentProps {
  type: 'strategist' | 'researcher' | 'writer' | 'analyst' | 'deposition' | 'discovery';
  size?: number;
  className?: string;
}

export function AIAgent({ type, size = 100, className = '' }: AIAgentProps) {
  const agents = {
    strategist: {
      primaryColor: '#9F5166',
      secondaryColor: '#8B4757',
      accentColor: '#C97A8E'
    },
    researcher: {
      primaryColor: '#2563EB',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA'
    },
    writer: {
      primaryColor: '#7C3AED',
      secondaryColor: '#6D28D9',
      accentColor: '#A78BFA'
    },
    analyst: {
      primaryColor: '#0D9488',
      secondaryColor: '#0F766E',
      accentColor: '#5EEAD4'
    },
    deposition: {
      primaryColor: '#EA580C',
      secondaryColor: '#C2410C',
      accentColor: '#FB923C'
    },
    discovery: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#34D399'
    }
  };

  const colors = agents[type];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill={`url(#agentGrad-${type})`} opacity="0.1" />
      
      {/* Main body - robot/AI representation */}
      <rect x="30" y="40" width="40" height="35" rx="6" fill={`url(#agentBody-${type})`} />
      
      {/* Head */}
      <rect x="35" y="25" width="30" height="20" rx="4" fill={`url(#agentHead-${type})`} />
      
      {/* Eyes */}
      <circle cx="42" cy="33" r="3" fill={colors.accentColor} />
      <circle cx="58" cy="33" r="3" fill={colors.accentColor} />
      
      {/* Antenna */}
      <line x1="50" y1="25" x2="50" y2="18" stroke={colors.primaryColor} strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="15" r="3" fill={colors.accentColor} />
      
      {/* Arms */}
      <rect x="20" y="48" width="12" height="5" rx="2.5" fill={colors.primaryColor} opacity="0.7" />
      <rect x="68" y="48" width="12" height="5" rx="2.5" fill={colors.primaryColor} opacity="0.7" />
      
      {/* Chest detail - varies by type */}
      {type === 'strategist' && (
        <path d="M 45 55 L 50 50 L 55 55 L 50 60 Z" fill={colors.accentColor} />
      )}
      {type === 'researcher' && (
        <>
          <circle cx="45" cy="55" r="3" fill={colors.accentColor} />
          <circle cx="55" cy="55" r="3" fill={colors.accentColor} />
          <circle cx="50" cy="62" r="3" fill={colors.accentColor} />
        </>
      )}
      {type === 'writer' && (
        <rect x="42" y="52" width="16" height="12" rx="2" fill={colors.accentColor} />
      )}
      {type === 'analyst' && (
        <>
          <line x1="42" y1="52" x2="42" y2="64" stroke={colors.accentColor} strokeWidth="2" />
          <line x1="50" y1="52" x2="50" y2="64" stroke={colors.accentColor} strokeWidth="2" />
          <line x1="58" y1="52" x2="58" y2="64" stroke={colors.accentColor} strokeWidth="2" />
        </>
      )}
      {type === 'deposition' && (
        <circle cx="50" cy="57" r="6" fill={colors.accentColor} />
      )}
      {type === 'discovery' && (
        <rect x="44" y="52" width="12" height="12" rx="1" fill={colors.accentColor} />
      )}
      
      {/* Base */}
      <rect x="38" y="75" width="24" height="4" rx="2" fill={colors.primaryColor} opacity="0.5" />
      
      <defs>
        <linearGradient id={`agentGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primaryColor} />
          <stop offset="100%" stopColor={colors.secondaryColor} />
        </linearGradient>
        <linearGradient id={`agentBody-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primaryColor} />
          <stop offset="100%" stopColor={colors.secondaryColor} />
        </linearGradient>
        <linearGradient id={`agentHead-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.secondaryColor} />
          <stop offset="100%" stopColor={colors.primaryColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}
