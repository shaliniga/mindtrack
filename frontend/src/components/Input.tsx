import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-zinc-800 tracking-tight"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center justify-center pointer-events-none z-10">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          {...rest}
          className={[
            'h-12 w-full bg-white text-sm font-medium text-zinc-900',
            'rounded-xl border outline-none transition-all duration-150',
            'placeholder:text-zinc-400 placeholder:font-normal',
            leftIcon ? 'pl-12 pr-4' : 'px-4',
            rightIcon ? 'pr-12' : '',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-zinc-200 hover:border-zinc-300 focus:border-[#00E676] focus:ring-2 focus:ring-[#00E676]/25',
            className,
          ].join(' ')}
        />

        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center justify-center z-10">
            {rightIcon}
          </span>
        )}
      </div>

      {(error || helperText) && (
        <p className={`text-xs mt-0.5 ${error ? 'text-red-500 font-medium' : 'text-zinc-500'}`}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}

