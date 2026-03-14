import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// 专业领域选项
const EXPERTISE_OPTIONS = [
  'Transformer Oil',
  'Lubricants',
  'Hydraulic Oil',
  'Gear Oil',
  'Turbine Oil',
  'Compressor Oil',
  'Refrigeration Oil',
  'Metalworking Fluid',
  'Grease',
  'Industry Analysis',
  'Market Trends',
  'Technical Standards',
];

// 发送限制配置
const SEND_LIMIT_CONFIG = {
  maxAttempts: 3, // 每3次后增加等待时间
  baseCooldown: 5 * 60, // 基础冷却时间：5分钟（第3次后）
  incrementCooldown: 5 * 60, // 每增加一组增加：5分钟
};

const AuthorRegister = () => {
  const [step, setStep] = useState(1); // 1: 邮箱验证, 2: 填写信息, 3: 提交成功
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0); // 60秒倒计时
  const [cooldown, setCooldown] = useState(0); // 防恶意攻击冷却时间
  
  // 表单数据
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    name: '',
    phone: '',
    company: '',
    bio: '',
    expertiseAreas: [] as string[],
  });

  // 从 localStorage 恢复发送记录
  const [sendRecord, setSendRecord] = useState<{
    email: string;
    count: number;
    firstSendTime: number;
    lastSendTime: number;
  } | null>(null);

  // 初始化：从 localStorage 加载发送记录
  useEffect(() => {
    const stored = localStorage.getItem('authorRegisterSendRecord');
    if (stored) {
      try {
        const record = JSON.parse(stored);
        setSendRecord(record);
        
        // 计算是否需要冷却
        const now = Date.now();
        const attempts = record.count;
        const groups = Math.floor(attempts / SEND_LIMIT_CONFIG.maxAttempts);
        
        if (groups >= 1) {
          const cooldownSeconds = groups * SEND_LIMIT_CONFIG.baseCooldown;
          const elapsed = Math.floor((now - record.lastSendTime) / 1000);
          const remaining = cooldownSeconds - elapsed;
          
          if (remaining > 0) {
            setCooldown(remaining);
          }
        }
      } catch {
        localStorage.removeItem('authorRegisterSendRecord');
      }
    }
  }, []);

  // 冷却倒计时
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // 60秒倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // 更新发送记录
  const updateSendRecord = (email: string) => {
    const now = Date.now();
    const newRecord = {
      email,
      count: (sendRecord?.email === email ? sendRecord.count : 0) + 1,
      firstSendTime: sendRecord?.firstSendTime || now,
      lastSendTime: now,
    };
    setSendRecord(newRecord);
    localStorage.setItem('authorRegisterSendRecord', JSON.stringify(newRecord));
    return newRecord.count;
  };

  // 计算冷却时间
  const calculateCooldown = (attempts: number): number => {
    const groups = Math.floor(attempts / SEND_LIMIT_CONFIG.maxAttempts);
    if (groups >= 1) {
      return groups * SEND_LIMIT_CONFIG.baseCooldown;
    }
    return 0;
  };

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  // 发送验证码
  const sendCode = async () => {
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // 检查冷却时间
    if (cooldown > 0) {
      toast.error(`Too many attempts. Please wait ${formatTime(cooldown)}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'register' }),
      });

      const data = await response.json();

      if (data.success) {
        // 更新发送记录
        const newCount = updateSendRecord(formData.email);
        
        toast.success('Verification code sent to your email');
        
        // 开始60秒倒计时
        setCountdown(60);
        
        // 检查是否需要设置冷却时间
        const cooldownTime = calculateCooldown(newCount);
        if (cooldownTime > 0) {
          // 显示警告
          const remainingAttempts = SEND_LIMIT_CONFIG.maxAttempts - (newCount % SEND_LIMIT_CONFIG.maxAttempts);
          if (remainingAttempts === SEND_LIMIT_CONFIG.maxAttempts) {
            // 刚好达到限制
            toast.warning(`Rate limit reached. After this, you'll need to wait ${formatTime(cooldownTime)} before sending again.`);
          }
        }
      } else {
        toast.error(data.error || 'Failed to send code');
      }
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const verifyCode = async () => {
    if (!formData.verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
          type: 'register',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email verified!');
        setStep(2);
      } else {
        toast.error(data.error || 'Invalid verification code');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 切换专业领域
  const toggleExpertise = (area: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter(a => a !== area)
        : [...prev.expertiseAreas, area],
    }));
  };

  // 提交申请
  const submitApplication = async () => {
    if (!formData.name) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/author/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          bio: formData.bio,
          expertiseAreas: formData.expertiseAreas,
          verificationCode: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(3);
        toast.success('Application submitted!');
      } else {
        toast.error(data.error || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  // 计算当前发送次数
  const currentAttempts = sendRecord?.email === formData.email ? sendRecord.count : 0;
  const remainingBeforeCooldown = SEND_LIMIT_CONFIG.maxAttempts - (currentAttempts % SEND_LIMIT_CONFIG.maxAttempts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SO</span>
              </div>
              <span className="text-2xl font-bold text-[#003366]">SpecialOil</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Become an Author</h1>
          <p className="text-slate-600">Join our community and share your expertise in special oils</p>
        </div>

        {/* 进度指示器 */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-r from-[#003366] to-[#004080] text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded transition-all ${
                    step > s ? 'bg-[#003366]' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 表单卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: 邮箱验证 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    disabled={countdown > 0}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={sendCode}
                    disabled={loading || countdown > 0 || cooldown > 0}
                    className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      countdown > 0 
                        ? 'bg-slate-200 text-slate-500' 
                        : cooldown > 0
                        ? 'bg-red-100 text-red-500'
                        : 'bg-gradient-to-r from-[#003366] to-[#004080] text-white hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Sending...
                      </span>
                    ) : countdown > 0 ? (
                      `${countdown}s`
                    ) : cooldown > 0 ? (
                      `Wait ${formatTime(cooldown)}`
                    ) : (
                      currentAttempts > 0 ? 'Resend Code' : 'Send Code'
                    )}
                  </button>
                </div>
                
                {/* 显示发送次数提示 */}
                {currentAttempts > 0 && countdown === 0 && cooldown === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    <i className="fa-solid fa-info-circle mr-1"></i>
                    {remainingBeforeCooldown === SEND_LIMIT_CONFIG.maxAttempts 
                      ? `Attempts: ${currentAttempts}. Next group will require a waiting period.`
                      : `${remainingBeforeCooldown} attempts remaining before rate limit.`
                    }
                  </p>
                )}
                
                {/* 冷却提示 */}
                {cooldown > 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                    Too many attempts. Please wait {formatTime(cooldown)} before sending again.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code *
                </label>
                <input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-center text-2xl tracking-widest"
                />
              </div>

              <button
                onClick={verifyCode}
                disabled={loading || !formData.verificationCode || formData.verificationCode.length < 6}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Verifying...
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
              
              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/author/login" className="text-[#D4AF37] font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: 填写信息 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-check text-green-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Email Verified</p>
                    <p className="text-sm text-green-600">{formData.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your Company Name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Areas of Expertise
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleExpertise(area)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        formData.expertiseAreas.includes(area)
                          ? 'bg-[#003366] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  About You
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your experience in the special oil industry..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={submitApplication}
                  disabled={loading || !formData.name}
                  className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 提交成功 */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-check text-4xl text-green-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
              <p className="text-slate-600 mb-6">
                Thank you for your interest in becoming an author. Our team will review your application and get back to you within 2-3 business days.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <i className="fa-solid fa-envelope mr-2"></i>
                  A confirmation email has been sent to <strong>{formData.email}</strong>
                </p>
              </div>
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>

        {/* 底部链接 */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>
            By registering, you agree to our{' '}
            <Link to="/terms-of-service" className="text-[#003366] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy-policy" className="text-[#003366] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorRegister;
