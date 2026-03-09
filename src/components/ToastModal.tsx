import { useEffect, useState } from 'react';

interface ToastModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  autoCloseDuration?: number;
}

export function ToastModal({ 
  isOpen, 
  type, 
  title, 
  message, 
  onClose,
  autoCloseDuration = 4000 
}: ToastModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 延迟添加动画类
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      // 自动关闭
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoCloseDuration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 等待动画完成
  };

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/30 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with icon */}
        <div className={`p-6 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
          <div className="flex justify-center">
            {isSuccess ? (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <button
            onClick={handleClose}
            className={`px-8 py-3 rounded-md text-white font-medium transition-all duration-200 ${
              isSuccess 
                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' 
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
          >
            OK
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className={`h-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'} animate-shrink`}
            style={{
              animation: `shrink ${autoCloseDuration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Success Modal Component
export function SuccessModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  return (
    <ToastModal
      isOpen={isOpen}
      type="success"
      title="Submission Successful!"
      message="Thank you for your inquiry. Our team will contact you within 24 hours."
      onClose={onClose}
    />
  );
}

// Error Modal Component
export function ErrorModal({ 
  isOpen, 
  onClose,
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  message?: string;
}) {
  return (
    <ToastModal
      isOpen={isOpen}
      type="error"
      title="Submission Failed"
      message={message || "Something went wrong. Please try again later or contact us directly."}
      onClose={onClose}
    />
  );
}
