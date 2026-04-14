interface ProgressBarProps {
  pct: number;
  color?: string;
  thin?: boolean;
}

export function ProgressBar({ pct, color = '#6b8c4a', thin = false }: ProgressBarProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        height: thin ? 4 : 8,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          height: '100%',
          background: color,
          borderRadius: 2,
          transition: 'width 0.5s ease',
          boxShadow: pct > 0 ? `0 0 8px ${color}60` : 'none',
        }}
      />
    </div>
  );
}
