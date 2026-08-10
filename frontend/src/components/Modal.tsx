import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeWidths = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-fadeIn" />

        {/* Content */}
        <Dialog.Content
          className={[
            'fixed top-1/2 left-1/2 z-[1001] -translate-x-1/2 -translate-y-1/2',
            'w-[calc(100vw-2rem)] rounded-[1.5rem] border border-zinc-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]',
            'flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden animate-scaleIn',
            sizeWidths[size],
          ].join(' ')}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex flex-col gap-6 p-8 pb-5 border-b border-zinc-100 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {title && (
                  <Dialog.Title className="text-lg font-bold text-zinc-900 m-0">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-xs text-zinc-500 mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close modal"
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors bg-transparent border-none cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
          )}

          {/* Body */}
          <div className="p-8 overflow-y-auto flex-1">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
