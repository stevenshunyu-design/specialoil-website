import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  title?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  title,
}) => {
  // Handle ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEsc) {
      onClose();
    }
  }, [closeOnEsc, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  // Add/remove event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    bottom: 'bottom-0 left-0 w-full',
  };

  const sizeClasses = {
    left: {
      sm: 'max-w-xs',
      md: 'max-w-sm',
      lg: 'max-w-md',
      full: 'max-w-xl',
    },
    right: {
      sm: 'max-w-xs',
      md: 'max-w-sm',
      lg: 'max-w-md',
      full: 'max-w-xl',
    },
    bottom: {
      sm: 'max-h-[40vh]',
      md: 'max-h-[60vh]',
      lg: 'max-h-[80vh]',
      full: 'max-h-[95vh]',
    },
  };

  const animationClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    bottom: 'animate-slide-in-up',
  };

  const isHorizontal = position === 'left' || position === 'right';

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Drawer Content */}
      <div
        className={`
          absolute ${positionClasses[position]}
          ${isHorizontal ? `w-full ${sizeClasses[position][size]}` : `h-full ${sizeClasses[position][size]}`}
          bg-white dark:bg-slate-900
          shadow-2xl
          ${animationClasses[position]}
          overflow-hidden
          flex flex-col
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            {title && (
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto
                  w-8 h-8 flex items-center justify-center
                  rounded-full 
                  bg-slate-100 dark:bg-slate-800 
                  hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-500 dark:text-slate-400
                  hover:text-slate-700 dark:hover:text-slate-200
                  transition-all duration-200
                  hover:scale-110"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
