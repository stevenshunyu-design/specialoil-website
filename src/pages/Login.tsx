import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBlog } from '../hooks/useBlog';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticateAdmin, setAuthenticated } = useBlog();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('请输入用户名和密码');
      return;
    }
    
    setIsLoading(true);
    
    // 模拟登录请求延迟
    setTimeout(() => {
      try {
        const success = authenticateAdmin(username, password);
        
        if (success) {
          setAuthenticated(true);
          toast.success('登录成功');
          navigate('/admin');
        } else {
          toast.error('用户名或密码错误');
        }
      } catch (error) {
        toast.error('登录失败，请重试');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#F4F6F9] p-8 rounded-sm">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#003366] font-['Montserrat']">
                Blog Admin Login
              </h1>
              <p className="text-[#333333]">Please enter your username and password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label htmlFor="username" className="block text-sm font-medium text-[#222222] mb-2">
                 Username
               </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
               <label htmlFor="password" className="block text-sm font-medium text-[#222222] mb-2">
                 Password
               </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                placeholder="请输入密码"
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-white px-8 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;