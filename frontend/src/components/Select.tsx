import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onValueChange,
  error,
  disabled,
  id,
  className = '',
}: SelectProps) {
  const selectId = id ?? `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-zinc-800 tracking-tight"
        >
          {label}
        </label>
      )}

      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          id={selectId}
          className={[
            'inline-flex h-12 w-full items-center justify-between gap-2 px-4',
            'rounded-xl border bg-white text-sm font-medium outline-none',
            'transition-all duration-150',
            value ? 'text-zinc-900' : 'text-zinc-400',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-zinc-200 hover:border-zinc-300 focus:border-[#00E676] focus:ring-2 focus:ring-[#00E676]/25',
          ].join(' ')}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={16} className="text-zinc-400 shrink-0" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-[999] min-w-[var(--radix-select-trigger-width)] max-h-72 overflow-y-auto bg-white rounded-lg border border-zinc-200 shadow-xl p-1 animate-scaleIn"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={[
                    'flex items-center justify-between px-3 py-2 text-sm text-zinc-800 rounded-md',
                    'cursor-pointer outline-none select-none transition-colors duration-150',
                    'hover:bg-[#E8FDF5] hover:text-[#00C853] focus:bg-[#E8FDF5] focus:text-[#00C853]',
                    'data-[state=checked]:font-semibold data-[state=checked]:text-[#00C853]',
                  ].join(' ')}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check size={14} className="text-[#00E676]" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <p className="text-xs font-medium text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
