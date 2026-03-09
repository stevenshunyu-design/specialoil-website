import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (email && status === 'idle') {
      handleUnsubscribe();
    }
  }, [email]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error');
      setMessage('No email address provided');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribers/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(result.message || 'You have been successfully unsubscribed.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-[#F4F6F9] rounded-sm p-8 md:p-12 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
              style={{
                background: status === 'success' 
                  ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                  : status === 'error'
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #003366 0%, #004488 100%)'
              }}
            >
              {status === 'loading' ? (
                <i className="fa-solid fa-spinner fa-spin text-3xl text-white"></i>
              ) : status === 'success' ? (
                <i className="fa-solid fa-check text-3xl text-white"></i>
              ) : status === 'error' ? (
                <i className="fa-solid fa-times text-3xl text-white"></i>
              ) : (
                <i className="fa-solid fa-envelope-open text-3xl text-white"></i>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)] mb-4 font-['Montserrat']">
              {status === 'loading' 
                ? 'Processing...'
                : status === 'success'
                ? 'Unsubscribed'
                : status === 'error'
                ? 'Error'
                : 'Newsletter Unsubscribe'}
            </h1>
          </div>

          {/* Content */}
          <div className="mb-8">
            {status === 'loading' && (
              <p className="text-[var(--muted-foreground)]">
                Please wait while we process your request...
              </p>
            )}

            {status === 'success' && (
              <div>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {message}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Email: <span className="font-medium text-[var(--primary-900)]">{email}</span>
                </p>
              </div>
            )}

            {status === 'error' && (
              <div>
                <p className="text-red-600 mb-4">{message}</p>
                <button
                  onClick={handleUnsubscribe}
                  className="inline-block bg-[var(--primary-900)] text-white px-6 py-3 rounded-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === 'idle' && !email && (
              <div>
                <p className="text-[var(--muted-foreground)] mb-6">
                  Enter your email address to unsubscribe from our newsletter.
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  We're sorry to see you go!
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {(status === 'success' || status === 'error') && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-block bg-[var(--primary-900)] text-white px-6 py-3 rounded-sm font-medium hover:opacity-90 transition-opacity"
              >
                Return to Homepage
              </Link>
              {status === 'success' && (
                <Link
                  to="/blog"
                  className="inline-block bg-[var(--accent-600)] text-white px-6 py-3 rounded-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Resubscribe
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Did you unsubscribe by mistake? You can always resubscribe from our Blog page.
          </p>
          <Link 
            to="/contact"
            className="text-[var(--accent-600)] hover:text-[var(--accent-700)] font-medium"
          >
            Contact us if you have any questions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
