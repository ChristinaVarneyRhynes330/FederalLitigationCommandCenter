interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'documents' | 'search' | 'scales' | 'folder';
}

export function EmptyState({ title, description, action, illustration = 'documents' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        {illustration === 'documents' && <DocumentsIllustration />}
        {illustration === 'search' && <SearchIllustration />}
        {illustration === 'scales' && <ScalesIllustration />}
        {illustration === 'folder' && <FolderIllustration />}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}

function DocumentsIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      {/* Back document */}
      <rect x="35" y="25" width="50" height="65" rx="4" fill="#E5E7EB" />
      <line x1="43" y1="35" x2="77" y2="35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="43" y1="45" x2="70" y2="45" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="43" y1="55" x2="77" y2="55" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      
      {/* Front document */}
      <rect x="45" y="35" width="50" height="65" rx="4" fill="url(#docGradient)" stroke="#375A8F" strokeWidth="2" />
      <line x1="53" y1="48" x2="87" y2="48" stroke="#2B4C7E" strokeWidth="2" strokeLinecap="round" />
      <line x1="53" y1="58" x2="80" y2="58" stroke="#2B4C7E" strokeWidth="2" strokeLinecap="round" />
      <line x1="53" y1="68" x2="87" y2="68" stroke="#2B4C7E" strokeWidth="2" strokeLinecap="round" />
      <line x1="53" y1="78" x2="75" y2="78" stroke="#2B4C7E" strokeWidth="2" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="docGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="50" cy="50" r="25" stroke="url(#searchGradient)" strokeWidth="4" fill="none" />
      <line x1="68" y1="68" x2="85" y2="85" stroke="url(#searchGradient)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="15" fill="#EFF6FF" />
      
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ScalesIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      {/* Simplified scales */}
      <rect x="56" y="25" width="4" height="60" fill="url(#scalesGrad)" />
      <rect x="30" y="40" width="60" height="3" fill="url(#scalesGrad)" />
      <circle cx="40" cy="60" r="15" stroke="#375A8F" strokeWidth="3" fill="#EFF6FF" />
      <circle cx="80" cy="60" r="15" stroke="#375A8F" strokeWidth="3" fill="#EFF6FF" />
      
      <defs>
        <linearGradient id="scalesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9F5166" />
          <stop offset="100%" stopColor="#8B4757" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FolderIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M 25 45 L 25 85 C 25 88 27 90 30 90 L 90 90 C 93 90 95 88 95 85 L 95 50 C 95 47 93 45 90 45 L 60 45 L 55 38 C 54 36 52 35 50 35 L 30 35 C 27 35 25 37 25 40 Z" 
            fill="url(#folderGradient)" 
            stroke="#375A8F" 
            strokeWidth="2" />
      
      <defs>
        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
      </defs>
    </svg>
  );
}
