interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
};

export function Spinner({ size = 'md', color, style }: SpinnerProps) {
  const px = sizeMap[size];
  return (
    <span
      role="status"
      aria-label="Loading"
      className="animate-spin"
      style={{
        display: 'inline-block',
        width: px,
        height: px,
        border: `${size === 'sm' ? 2 : 3}px solid var(--color-border)`,
        borderTopColor: color ?? 'var(--color-primary)',
        borderRadius: '50%',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// Full-page loading overlay
export function PageSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <Spinner size="lg" />
    </div>
  );
}
