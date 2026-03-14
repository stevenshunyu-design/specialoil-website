import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import BlogCard from '../components/BlogCard';
import { SubscribeSuccessModal, SubscribeErrorModal } from '@/components/ToastModal';
import useSEO from '@/hooks/useSEO';

// 作者信息类型
interface AuthorInfo {
  id: number;
  username: string;
  display_name: string;
  email: string;
  avatar_url?: string;
}

const Blog = () => {
  const { t } = useTranslation();
  
  // Initialize SEO for this page
  useSEO('blog');
  
  // 作者登录状态
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 所有Hooks必须放在组件顶部，确保每次渲染都以相同顺序调用
  const { posts, isLoading, searchPosts } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Newsletter 订阅状态
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // 检查作者登录状态
  useEffect(() => {
    const checkAuth = () => {
      const storedAuthor = localStorage.getItem('authorInfo');
      if (storedAuthor) {
        try {
          const author = JSON.parse(storedAuthor);
          setAuthorInfo(author);
          setIsLoggedIn(true);
        } catch {
          localStorage.removeItem('authorInfo');
          setIsLoggedIn(false);
        }
      }
    };
    checkAuth();
    
    // 监听storage变化（其他标签页登录/登出）
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
  // 作者登出
  const handleLogout = () => {
    localStorage.removeItem('authorInfo');
    setAuthorInfo(null);
    setIsLoggedIn(false);
  };
  
  // 分类列表
  const categories = ['All', 'Industry News', 'Technical Information', 'Market Analysis', 'Product Updates'];
  
  // 分类翻译映射
  const categoryLabels: Record<string, string> = {
    'All': t('blog.categories.all'),
    'Industry News': t('blog.categories.industryNews'),
    'Technical Information': t('blog.categories.technicalInfo'),
    'Market Analysis': t('blog.categories.marketAnalysis'),
    'Product Updates': t('blog.categories.productUpdates')
  };

  // 搜索功能
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredPosts(searchPosts(searchQuery));
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts, searchPosts]);
  
  // Newsletter 订阅处理
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriberEmail.trim()) {
      setErrorMessage('Please enter your email address');
      setShowErrorModal(true);
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriberEmail.trim() }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }
      
      setSubscriberEmail('');
      setSuccessMessage(result.message || 'Thank you for subscribing! Please check your email for confirmation.');
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
      setShowErrorModal(true);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-[#D4AF37] mb-4"></i>
          <p className="text-xl text-[#333333]">{t('blog.loading')}</p>
        </div>
      </div>
    );
  }
  
  // 根据分类过滤文章
  const filteredByCategory = activeCategory === 'All' 
    ? filteredPosts 
    : filteredPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative h-80 md:h-96 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/80 to-[#003366]/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=China%20special%20oil%20industry%20news%2C%20industrial%20cinematic%20style&sign=5f2862a71a389200cb51a21eb3534804" 
              alt={t('blog.hero.alt')} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight mb-4">
                {t('blog.hero.title')}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {t('blog.hero.subtitle', 'Insights, trends, and expertise from industry professionals')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Search & Filter Bar */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-[#F4F6F9] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-[#D4AF37] text-white shadow-md'
                      : 'bg-[#F4F6F9] text-[#333333] hover:bg-gray-200'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Blog Posts Grid */}
        <section className="mb-16">
          {filteredByCategory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredByCategory.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F4F6F9] rounded-lg">
              <i className="fa-solid fa-search text-5xl text-gray-300 mb-4"></i>
              <p className="text-xl text-[#333333] mb-2">{t('blog.noArticles')}</p>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="inline-block bg-[#003366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                {t('blog.viewAll')}
              </button>
            </div>
          )}
        </section>
        
        {/* Industry Insights - Compact Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#003366] font-['Montserrat']">
            {t('blog.insights.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-[#003366] to-[#004080] p-6 rounded-lg text-white hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">{t('blog.insights.trends.title')}</h3>
              <p className="text-white/70 text-sm mb-3">{t('blog.insights.trends.description')}</p>
              <span className="text-[#D4AF37] text-sm font-medium">
                {t('blog.insights.trends.link')} <i className="fa-solid fa-arrow-right ml-1"></i>
              </span>
            </div>
            
            <div className="group bg-gradient-to-br from-[#D4AF37] to-[#B8960C] p-6 rounded-lg text-white hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-lightbulb text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">{t('blog.insights.guides.title')}</h3>
              <p className="text-white/70 text-sm mb-3">{t('blog.insights.guides.description')}</p>
              <span className="text-white text-sm font-medium">
                {t('blog.insights.guides.link')} <i className="fa-solid fa-arrow-right ml-1"></i>
              </span>
            </div>
            
            <div className="group bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] p-6 rounded-lg text-white hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-certificate text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">{t('blog.insights.regulatory.title')}</h3>
              <p className="text-white/70 text-sm mb-3">{t('blog.insights.regulatory.description')}</p>
              <span className="text-[#D4AF37] text-sm font-medium">
                {t('blog.insights.regulatory.link')} <i className="fa-solid fa-arrow-right ml-1"></i>
              </span>
            </div>
          </div>
        </section>
        
        {/* Newsletter Subscription */}
        <section className="mb-16 bg-gradient-to-r from-[#003366] to-[#004080] rounded-lg overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <i className="fa-solid fa-envelope text-[#D4AF37] text-2xl"></i>
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-['Montserrat']">
                    {t('blog.subscribe.title')}
                  </h2>
                </div>
                <p className="text-white/70">
                  {t('blog.subscribe.description')}
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder={t('blog.subscribe.placeholder')}
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="px-5 py-3 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent w-full sm:w-72"
                  disabled={isSubscribing}
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#C9A227] transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      {t('blog.subscribe.subscribing')}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      {t('blog.subscribe.button')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Author Portal Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-[#F4F6F9] via-white to-[#F4F6F9] rounded-lg border border-gray-200 overflow-hidden">
            {isLoggedIn && authorInfo ? (
              /* 已登录状态 - 紧凑型欢迎卡片 */
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {authorInfo.display_name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('blog.author.welcome', { name: '' }).replace(',', '')}</p>
                      <h3 className="text-xl font-bold text-[#003366]">{authorInfo.display_name}</h3>
                      <p className="text-sm text-gray-500">{t('blog.author.subtitle.loggedIn')}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/author/write"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span>{t('blog.author.writeArticle')}</span>
                    </Link>
                    <Link
                      to="/author/dashboard"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#003366] border-2 border-[#003366] rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-chart-pie"></i>
                      <span>{t('blog.author.myDashboard')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg font-medium transition-all"
                    >
                      <i className="fa-solid fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* 未登录状态 - 吸引作者加入 */
              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* 左侧：内容 */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium mb-4">
                      <i className="fa-solid fa-star"></i>
                      <span>Join Our Expert Community</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#003366] mb-3 font-['Montserrat']">
                      {t('blog.author.title')}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6 max-w-lg">
                      {t('blog.author.subtitle.guest')}
                    </p>
                    
                    {/* 作者权益 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center">
                          <i className="fa-solid fa-pen-nib text-[#003366]"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#003366]">Share Insights</p>
                          <p className="text-xs text-gray-500">Publish articles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          <i className="fa-solid fa-users text-[#D4AF37]"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#003366]">Build Audience</p>
                          <p className="text-xs text-gray-500">Grow followers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center">
                          <i className="fa-solid fa-award text-[#003366]"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#003366]">Get Recognized</p>
                          <p className="text-xs text-gray-500">Author profile</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 按钮组 */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                      <Link
                        to="/author/register"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                      >
                        <i className="fa-solid fa-user-plus"></i>
                        <span>{t('blog.author.becomeAuthor')}</span>
                      </Link>
                      <Link
                        to="/author/login"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-[#003366] border-2 border-[#003366] rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition-all"
                      >
                        <i className="fa-solid fa-sign-in-alt"></i>
                        <span>{t('blog.author.login')}</span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* 右侧：装饰图 */}
                  <div className="hidden lg:block w-80 flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#003366]/20 rounded-2xl transform rotate-6"></div>
                      <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] rounded-full flex items-center justify-center text-white font-bold">
                            JD
                          </div>
                          <div>
                            <p className="font-bold text-[#003366]">John Doe</p>
                            <p className="text-xs text-gray-500">Senior Engineer</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-full"></div>
                          <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                          <div className="h-3 bg-gray-100 rounded w-3/5"></div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span><i className="fa-solid fa-eye mr-1"></i> 1.2k</span>
                            <span><i className="fa-solid fa-heart mr-1"></i> 89</span>
                          </div>
                          <span className="text-xs text-[#D4AF37] font-medium">Published</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Modals */}
      <SubscribeSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      <SubscribeErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex border-t border-gray-200">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>{t('blog.mobile.contact')}</span>
        </a>
        <a 
          href="https://wa.me/8613793280176" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 py-4 bg-[#25D366] text-white flex items-center justify-center"
        >
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>{t('blog.mobile.whatsapp')}</span>
        </a>
      </div>
    </div>
  );
};

export default Blog;
