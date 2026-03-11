import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <>
      {/* Language Button - 使用金色强调色与页面tag保持一致 */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
        aria-label="Select language"
      >
        <i className="fa-solid fa-globe text-lg text-[var(--accent-brand,#D4AF37)] group-hover:animate-pulse"></i>
        <span className="hidden md:inline text-[var(--text-dark)] group-hover:text-[var(--accent-brand,#D4AF37)] transition-colors">
          {currentLanguage.nativeName}
        </span>
      </button>

      {/* Modal Overlay - 使用Portal渲染到body，确保不受父元素影响 */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          {/* Modal Content */}
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
            style={{ animation: 'scaleIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-[var(--bg-surface,#F8FAFC)] to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-brand,#D4AF37)]/10 flex items-center justify-center">
                  <i className="fa-solid fa-globe text-[var(--accent-brand,#D4AF37)] text-lg"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-dark,#1a1a1a)]">Select Language</h2>
                  <p className="text-sm text-gray-500">Choose your preferred language</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                aria-label="Close"
              >
                <i className="fa-solid fa-times text-sm"></i>
              </button>
            </div>

            {/* Language Grid */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => {
                  const isSelected = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left group ${
                        isSelected
                          ? 'bg-[var(--accent-brand,#D4AF37)]/10 border-2 border-[var(--accent-brand,#D4AF37)] shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                      }`}
                    >
                      {/* 选中指示器 */}
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <i className="fa-solid fa-check-circle text-[var(--accent-brand,#D4AF37)] text-sm"></i>
                        </div>
                      )}
                      
                      {/* 语言代码标识 */}
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold uppercase transition-colors ${
                        isSelected 
                          ? 'bg-[var(--accent-brand,#D4AF37)] text-white' 
                          : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                      }`}>
                        {lang.code.split('-')[0]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className={`block font-medium truncate ${
                          isSelected ? 'text-[var(--text-dark,#1a1a1a)]' : 'text-gray-900'
                        }`}>
                          {lang.nativeName}
                        </span>
                        <span className="text-xs text-gray-500 truncate">{lang.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <i className="fa-solid fa-language"></i>
                <span>Language preference saved automatically</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default LanguageSelector;
