interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniChart({ data, color = '#0D9488', height = 40 }: MiniChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <svg width="100%" height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={`
          M 0 ${height}
          ${data.map((value, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = height - ((value - min) / range) * height;
            return `L ${x}% ${y}`;
          }).join(' ')}
          L 100% ${height}
          Z
        `}
        fill={`url(#gradient-${color})`}
      />
      
      {/* Line */}
      <path
        d={`
          M ${data.map((value, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = height - ((value - min) / range) * height;
            return `${x}% ${y}`;
          }).join(' L ')}
        `}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Dots */}
      {data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - ((value - min) / range) * height;
        return (
          <circle
            key={i}
            cx={`${x}%`}
            cy={y}
            r="3"
            fill={color}
          />
        );
      })}
    </svg>
  );
}
