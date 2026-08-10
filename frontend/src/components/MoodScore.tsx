const MOOD_CONFIG = [
  { score: 1, emoji: '😞', label: 'Very Low',  color: 'var(--mood-1)' },
  { score: 2, emoji: '😟', label: 'Low',        color: 'var(--mood-2)' },
  { score: 3, emoji: '😐', label: 'Neutral',    color: 'var(--mood-3)' },
  { score: 4, emoji: '😊', label: 'Good',       color: 'var(--mood-4)' },
  { score: 5, emoji: '😄', label: 'Great',      color: 'var(--mood-5)' },
];

interface MoodScoreProps {
  score: number;
  showLabel?: boolean;
  showEmoji?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodScore({
  score,
  showLabel = false,
  showEmoji = true,
  size = 'md',
}: MoodScoreProps) {
  // Handle decimal averages by rounding
  const rounded = Math.round(score);
  const config = MOOD_CONFIG[Math.min(Math.max(rounded, 1), 5) - 1];

  const fontSize =
    size === 'sm' ? '0.75rem' :
    size === 'md' ? '0.875rem' :
    '1rem';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      fontSize,
      fontWeight: 600,
      color: config.color,
    }}>
      {showEmoji && <span>{config.emoji}</span>}
      <span>{score}</span>
      {showLabel && (
        <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
          ({config.label})
        </span>
      )}
    </span>
  );
}

// Color helper — useful for Recharts stroke colors
export function getMoodColor(score: number): string {
  const rounded = Math.round(score);
  return MOOD_CONFIG[Math.min(Math.max(rounded, 1), 5) - 1].color;
}

export { MOOD_CONFIG };
