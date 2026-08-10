const COLORS = [
  { bg: '#EEF1FE', color: '#4F6EF7' },
  { bg: '#D1FAE5', color: '#10B981' },
  { bg: '#FEF3C7', color: '#D97706' },
  { bg: '#FEE2E2', color: '#EF4444' },
  { bg: '#F0F9FF', color: '#0EA5E9' },
  { bg: '#FAF5FF', color: '#7C3AED' },
  { bg: '#FFF0F6', color: '#EC4899' },
];

const sizeCls: Record<string, string> = {
  sm: 'w-7 h-7 text-[0.7rem]',
  md: 'w-9 h-9 text-[0.8125rem]',
  lg: 'w-11 h-11 text-[0.9375rem]',
  xl: 'w-14 h-14 text-[1.125rem]',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColor(name: string) {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const { bg, color } = getColor(name);
  const initials = getInitials(name);

  return (
    <div
      title={name}
      className={`rounded-full flex items-center justify-center shrink-0 select-none font-semibold ${sizeCls[size]} ${className}`}
      style={{ background: bg, color }}
    >
      {initials}
    </div>
  );
}
