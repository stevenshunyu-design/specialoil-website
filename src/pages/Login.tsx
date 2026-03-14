import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      toast.error('请输入邮箱地址');
      return;
    }

    if (!email.includes('@')) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await fetch('/api/admin/send-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('验证码已发送到您的邮箱');
        setCountdown(60); // 60秒倒计时
      } else {
        toast.error(data.error || '发送验证码失败');
      }
    } catch (error) {
      toast.error('发送验证码失败');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 验证登录
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      toast.error('请输入邮箱和验证码');
      return;
    }

    if (code.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 存储登录状态
        localStorage.setItem('adminToken', Date.now().toString());
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        toast.success('登录成功');
        navigate('/admin');
      } else {
        toast.error(data.error || '验证码错误或已过期');
      }
    } catch (error) {
      toast.error('登录失败，请重试');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-shield-halved text-2xl text-white"></i>
            </div>
            <h1 className="text-2xl font-bold text-[#003366]">
              管理员登录
            </h1>
            <p className="text-slate-500 mt-2">使用邮箱验证码安全登录</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                管理员邮箱
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  placeholder="请输入管理员邮箱"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    placeholder="6位验证码"
                    maxLength={6}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0 || !email}
                  className="px-4 py-3 bg-[#003366] text-white rounded-xl font-medium hover:bg-[#002255] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSendingCode ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    '发送验证码'
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    验证中...
                  </span>
                ) : (
                  '登录'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              验证码将在10分钟后过期
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
