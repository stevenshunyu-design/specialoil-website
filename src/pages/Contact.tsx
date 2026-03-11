import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { SuccessModal, ErrorModal } from '@/components/ToastModal';
import useSEO from '@/hooks/useSEO';

// hCaptcha site key (public key)
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '80a2bfa8-da8c-4326-bada-a5e8ad02727e';

// Initialize SEO hook outside of component
const useContactSEO = () => useSEO('contact');

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact' | 'invisible';
      }) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
      execute: (widgetId?: string) => void;
    };
  }
}

const Contact = () => {
  // Initialize SEO for this page
  useContactSEO();
  
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    productCategory: '',
    portOfDestination: '',
    estimatedQuantity: '',
    message: '',
    // Honeypot fields - hidden from users, bots will fill them
    website: '',
    phone: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const [captchaWidgetId, setCaptchaWidgetId] = useState<string | null>(null);
  
  // Track form open time for timing validation
  const formOpenTime = useRef(Date.now());
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  
  // Form validation schema
  const contactFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(100),
    company: z.string().min(1, { message: 'Company is required' }).max(200),
    email: z.string().email({ message: 'Invalid email address' }).max(254),
    productCategory: z.string().optional(),
    portOfDestination: z.string().min(1, { message: 'Port of Destination is required for CIF quote' }).max(200),
    estimatedQuantity: z.string().optional(),
    message: z.string().max(2000).optional()
  });
  
  // Load hCaptcha script
  useEffect(() => {
    const loadHcaptcha = () => {
      if (window.hcaptcha) {
        setCaptchaLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setCaptchaLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load hCaptcha script');
      };
      document.head.appendChild(script);
    };
    
    loadHcaptcha();
    
    return () => {
      formOpenTime.current = Date.now();
    };
  }, []);
  
  // Render hCaptcha widget when loaded
  useEffect(() => {
    if (captchaLoaded && window.hcaptcha && captchaContainerRef.current && !captchaWidgetId) {
      try {
        const widgetId = window.hcaptcha.render(captchaContainerRef.current, {
          sitekey: HCAPTCHA_SITE_KEY,
          theme: 'light',
          callback: (token: string) => {
            setCaptchaToken(token);
          },
          'error-callback': () => {
            setErrorMessage('Captcha verification failed. Please try again.');
          }
        });
        setCaptchaWidgetId(widgetId);
      } catch (error) {
        console.error('hCaptcha render error:', error);
      }
    }
  }, [captchaLoaded, captchaWidgetId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot fields (if filled, it's likely a bot)
    if (formData.website || formData.phone) {
      console.log('Honeypot triggered - likely bot submission');
      // Return success to confuse bots
      setShowSuccessModal(true);
      return;
    }
    
    // Validate form data
    try {
      contactFormSchema.parse(formData);
      
      // Check if captcha is completed (skip in test mode)
      if (HCAPTCHA_SITE_KEY && !captchaToken) {
        setErrorMessage('Please complete the security verification.');
        setShowErrorModal(true);
        return;
      }
      
      setIsSubmitting(true);
      
      // Prepare submission data
      const submissionData = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        productCategory: formData.productCategory || undefined,
        portOfDestination: formData.portOfDestination.trim(),
        estimatedQuantity: formData.estimatedQuantity || undefined,
        message: formData.message?.trim() || undefined,
        captchaToken,
        _startTime: formOpenTime.current,
      };
      
      // 提交到后端 API
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        productCategory: '',
        portOfDestination: '',
        estimatedQuantity: '',
        message: '',
        website: '',
        phone: '',
      });
      setCaptchaToken('');
      formOpenTime.current = Date.now();
      
      // Reset captcha
      if (window.hcaptcha && captchaWidgetId) {
        window.hcaptcha.reset(captchaWidgetId);
      }
      
    } catch (error) {
      let errorMsg = 'An error occurred. Please try again later.';
      if (error instanceof z.ZodError) {
        errorMsg = error.errors[0].message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=International%20trade%20and%20logistics%20meeting%2C%20industrial%20cinematic%20style%2C%20high%20contrast%2C%20blue%20and%20gold%20lighting&sign=fbedf4ff8595f4cc9f103a565cb8c1df" 
              alt={t('contact.hero.alt')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight text-center px-4 text-shadow-sm">
                  {t('contact.hero.title')}
                </h1>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#F4F6F9] p-8 rounded-sm">
              <h2 className="text-3xl font-bold mb-6 text-[var(--primary-brand)] font-['Montserrat'] tracking-tight">
                {t('contact.form.title')}
              </h2>
              <p className="text-[#333333] mb-8">
                {t('contact.form.subtitle')}
              </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#222222] mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                    placeholder={t('contact.form.namePlaceholder')}
                    required
                    maxLength={100}
                    autoComplete="name"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#222222] mb-2">
                    {t('contact.form.company')} *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                    placeholder={t('contact.form.companyPlaceholder')}
                    required
                    maxLength={200}
                    autoComplete="organization"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#222222] mb-2">
                  {t('contact.form.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  placeholder={t('contact.form.emailPlaceholder')}
                  required
                  maxLength={254}
                  autoComplete="email"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-[#222222] mb-2">
                    {t('contact.form.productCategory')}
                  </label>
                  <select
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  >
                    <option value="">{t('contact.form.selectProduct')}</option>
                    <option value="transformer-oil">{t('contact.form.products.transformer')}</option>
                    <option value="rubber-process-oil">{t('contact.form.products.rubber')}</option>
                    <option value="hydraulic-oil">{t('contact.form.products.hydraulic')}</option>
                    <option value="gear-oil">{t('contact.form.products.gear')}</option>
                    <option value="other">{t('contact.form.products.other')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="portOfDestination" className="block text-sm font-medium text-[#222222] mb-2">
                    {t('contact.form.destinationPort')} *
                  </label>
                  <input
                    type="text"
                    id="portOfDestination"
                    name="portOfDestination"
                    value={formData.portOfDestination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                    placeholder={t('contact.form.destinationPortPlaceholder')}
                    required
                    maxLength={200}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="estimatedQuantity" className="block text-sm font-medium text-[#222222] mb-2">
                  {t('contact.form.quantity')}
                </label>
                <input
                  type="text"
                  id="estimatedQuantity"
                  name="estimatedQuantity"
                  value={formData.estimatedQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  placeholder={t('contact.form.quantityPlaceholder')}
                  maxLength={100}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#222222] mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                  maxLength={2000}
                ></textarea>
              </div>
              
              {/* Honeypot fields - hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>
              
              {/* hCaptcha */}
              <div className="flex justify-center">
                <div 
                  ref={captchaContainerRef} 
                  className="h-captcha"
                  data-sitekey={HCAPTCHA_SITE_KEY}
                  data-theme="light"
                ></div>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-block bg-[#D4AF37] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      {t('contact.form.processing')}
                    </span>
                  ) : (
                    t('contact.form.submit')
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                <i className="fa-solid fa-shield-halved mr-1"></i>
                {t('contact.form.protectedBy')}{' '}
                <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#003366]">
                  {t('contact.form.privacyPolicy')}
                </a>{' '}
                {t('contact.form.and')}{' '}
                <a href="https://www.hcaptcha.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#003366]">
                  {t('contact.form.termsOfService')}
                </a>{' '}
                {t('contact.form.apply')}.
              </p>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-[#F4F6F9] p-8 rounded-sm mb-8">
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('contact.info.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#003366] text-white rounded-full h-12 w-12 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#222222] mb-1">{t('contact.info.email.title')}</h3>
                    <p className="text-[#333333] mb-2">{t('contact.info.email.description')}</p>
                    <a href="mailto:steven.shunyu@gmail.com" className="text-[#003366] font-semibold hover:text-[#D4AF37] transition-colors">
                      steven.shunyu@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#003366] text-white rounded-full h-12 w-12 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#222222] mb-1">{t('contact.info.whatsapp.title')}</h3>
                    <p className="text-[#333333] mb-2">{t('contact.info.whatsapp.description')}</p>
                    <a href="https://wa.me/8613793280176" className="text-[#003366] font-semibold hover:text-[#D4AF37] transition-colors">
                      +86 137 9328 0176
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#003366] text-white rounded-full h-12 w-12 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#222222] mb-1">{t('contact.info.phone.title')}</h3>
                    <p className="text-[#333333] mb-2">{t('contact.info.phone.description')}</p>
                    <a href="tel:+8613793280176" className="text-[#003366] font-semibold hover:text-[#D4AF37] transition-colors">
                      +86 137 9328 0176
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#003366] text-white rounded-full h-12 w-12 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#222222] mb-1">{t('contact.info.hours.title')}</h3>
                    <p className="text-[#333333]">
                      {t('contact.info.hours.weekdays')}<br />
                      {t('contact.info.hours.saturday')}<br />
                      {t('contact.info.hours.whatsapp')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#003366] text-white rounded-full h-12 w-12 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#222222] mb-1">{t('contact.info.address.title')}</h3>
                    <p className="text-[#333333]">
                      {t('contact.info.address.line1')}<br />
                      {t('contact.info.address.line2')}<br />
                      {t('contact.info.address.line3')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F4F6F9] p-8 rounded-sm">
              <h2 className="text-3xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                {t('contact.team.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-2xl mr-4 flex-shrink-0">
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#222222]">{t('contact.team.steven.name')}</h3>
                    <p className="text-[#333333] mb-1">{t('contact.team.steven.role')}</p>
                    <a href="mailto:steven.shunyu@gmail.com" className="text-[#003366] hover:text-[#D4AF37] transition-colors">
                      steven.shunyu@gmail.com
                    </a>
                    <p className="text-[#333333] mt-1">{t('contact.team.steven.languages')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <a href="https://www.linkedin.com/in/shunyu-zhang-511354266/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#003366] text-white flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="https://wa.me/8613793280176" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#003366] text-white flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
                <a href="mailto:steven.shunyu@gmail.com" className="w-12 h-12 rounded-full bg-[#003366] text-white flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <section className="mt-16 bg-[#F4F6F9] p-8 rounded-sm">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#003366] font-['Montserrat']">
            {t('contact.faq.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{t('contact.faq.q1.question')}</h3>
              <p className="text-[#333333]">{t('contact.faq.q1.answer')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{t('contact.faq.q2.question')}</h3>
              <p className="text-[#333333]">{t('contact.faq.q2.answer')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{t('contact.faq.q3.question')}</h3>
              <p className="text-[#333333]">{t('contact.faq.q3.answer')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{t('contact.faq.q4.question')}</h3>
              <p className="text-[#333333]">{t('contact.faq.q4.answer')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{t('contact.faq.q5.question')}</h3>
              <p className="text-[#333333]">{t('contact.faq.q5.answer')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{t('contact.faq.q6.question')}</h3>
              <p className="text-[#333333]">{t('contact.faq.q6.answer')}</p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>{t('contact.mobile.call')}</span>
        </a>
        <a href="https://wa.me/8613793280176" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>{t('contact.mobile.whatsapp')}</span>
        </a>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />

      {/* Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default Contact;
