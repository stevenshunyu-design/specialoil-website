import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthorLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/author/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 保存作者信息到 localStorage
        localStorage.setItem('author', JSON.stringify(data.author));
        toast.success('Login successful!');
        navigate('/author/dashboard');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Author Login</h1>
          <p className="text-slate-600">Welcome back! Please login to your author account</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/author/register" className="text-[#D4AF37] font-medium hover:underline">
                Apply here
              </Link>
            </p>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm text-center">
            <strong>💡 First time here?</strong> Your account will be created after your application is approved.
            Check your email for login credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorLogin;
