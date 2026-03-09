import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';
import BlogCard from '../components/BlogCard';
import { SuccessModal, ErrorModal } from '@/components/ToastModal';

const Blog = () => {
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
  const [errorMessage, setErrorMessage] = useState('');
  
  // 分类列表
  const categories = ['All', 'Industry News', 'Technical Information', 'Market Analysis', 'Product Updates'];

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
          <p className="text-xl text-[#333333]">Loading articles...</p>
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
        <section className="mb-16">
          <div className="relative h-96 overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=China%20special%20oil%20industry%20news%2C%20industrial%20cinematic%20style&sign=5f2862a71a389200cb51a21eb3534804" 
              alt="China Special Oil Industry News" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Montserrat'] tracking-tight text-center px-4 text-shadow-sm">
                  China Special Oil Industry News & Insights
                </h1>
              </div>
          </div>
        </section>
        
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-[#F4F6F9] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D4AF37]">
              <i className="fa-solid fa-search text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-[#F4F6F9] text-[#333333] hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Blog Posts */}
        <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-[#003366] font-['Montserrat']">
              Latest Articles
            </h2>
          
          {filteredByCategory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredByCategory.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F4F6F9] rounded-sm">
              <i className="fa-solid fa-search text-4xl text-gray-400 mb-4"></i>
              <p className="text-xl text-[#333333]">No articles found</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 inline-block bg-[#003366] text-white px-6 py-2 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                  View All Articles
                </button>
            </div>
          )}
        </section>
        
        {/* Industry Insights Highlight */}
        <section className="mb-16 bg-[#F4F6F9] p-8 rounded-sm">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#003366] font-['Montserrat']">
            Key Insights on Chinese Special Oil Market
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <div className="text-[#D4AF37] text-3xl mb-4">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                Market Trends
              </h3>
              <p className="text-[#333333] mb-4">
                Stay updated with the latest trends in China's special oil industry and global market developments.
              </p>
              <Link 
                to="#"
                className="text-[#003366] font-semibold hover:text-[#D4AF37] transition-colors"
              >
                Explore trends <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <div className="text-[#D4AF37] text-3xl mb-4">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                Technical Guides
              </h3>
              <p className="text-[#333333] mb-4">
                Detailed technical information and guidelines for proper application of Chinese special oils.
              </p>
              <Link 
                to="#"
                className="text-[#003366] font-semibold hover:text-[#D4AF37] transition-colors"
              >
                View guides <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <div className="text-[#D4AF37] text-3xl mb-4">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#003366] font-['Montserrat']">
                Regulatory Updates
              </h3>
              <p className="text-[#333333] mb-4">
                Latest regulatory changes and compliance requirements affecting the special oil industry.
              </p>
              <Link 
                to="#"
                className="text-[#003366] font-semibold hover:text-[#D4AF37] transition-colors"
              >
                Read updates <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-[var(--primary-900)] text-white p-8 rounded-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
               <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2 text-white">
                  Subscribe to Our Newsletter
                </h2>
                <p className="font-body text-white/80">
                  Get the latest China special oil industry news and technical insights delivered to your inbox
                </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="px-4 py-3 bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)] w-full sm:w-64"
                disabled={isSubscribing}
              />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="inline-block bg-[var(--accent-600)] text-white px-6 py-3 rounded-sm font-medium hover:bg-[var(--accent-700)] transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
          </div>
        </section>
      </div>
      
      {/* Modals */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8613800138000" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>Contact Us</span>
        </a>
        <a href="https://wa.me/8613800138000" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Blog;