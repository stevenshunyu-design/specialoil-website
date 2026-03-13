import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useBlog } from '../hooks/useBlog';
import { BlogPost } from '../types/blog';
import InquiriesAdmin from './InquiriesAdmin';
import RichTextEditor from '../components/RichTextEditor';
import ImageLibrary from '../components/ImageLibrary';

// 类型定义
type AdminTab = 'dashboard' | 'articles' | 'inquiries' | 'subscribers' | 'chat';

// 统计卡片组件
const StatCard = ({ icon, label, value, color, trend }: { 
  icon: string; 
  label: string; 
  value: string | number; 
  color: string;
  trend?: { value: number; isUp: boolean };
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`fa-solid fa-${trend.isUp ? 'arrow-up' : 'arrow-down'} mr-1`}></i>
            {trend.value}% vs last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <i className={`fa-solid ${icon} text-white text-xl`}></i>
      </div>
    </div>
  </div>
);

// 文章列表组件
const ArticleList = ({ onEdit }: { onEdit: (id: string) => void }) => {
  const { posts, deletePost } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', ...new Set(posts.map(p => p.category))];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定要删除文章 "${title}" 吗？此操作不可恢复。`)) {
      const success = deletePost(id);
      if (success) {
        toast.success('文章已删除');
      } else {
        toast.error('删除失败，请重试');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? '全部分类' : cat}</option>
          ))}
        </select>
      </div>

      {/* 文章表格 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">文章</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">发布日期</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.featuredImage && (
                          <img 
                            src={post.featuredImage} 
                            alt="" 
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(post.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fa-solid fa-file-circle-exclamation text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 mb-4">暂无文章</p>
                      <Link 
                        to="/admin/new" 
                        className="text-[#D4AF37] hover:underline font-medium"
                      >
                        创建第一篇文章
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 仪表盘组件
const Dashboard = ({ posts, onNavigate }: { posts: BlogPost[]; onNavigate: (tab: AdminTab) => void }) => {
  const [inquiryCount, setInquiryCount] = useState(0);
  
  useEffect(() => {
    fetch('/api/inquiries')
      .then(res => res.json())
      .then(data => setInquiryCount(data.data?.length || 0))
      .catch(() => {});
  }, []);
  
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="fa-file-lines" 
          label="文章总数" 
          value={posts.length}
          color="bg-blue-500"
        />
        <StatCard 
          icon="fa-envelope" 
          label="客户询价" 
          value={inquiryCount}
          color="bg-green-500"
        />
        <StatCard 
          icon="fa-users" 
          label="订阅用户" 
          value={0}
          color="bg-purple-500"
        />
        <StatCard 
          icon="fa-eye" 
          label="本月浏览" 
          value="1,234"
          color="bg-orange-500"
          trend={{ value: 12, isUp: true }}
        />
      </div>

      {/* 最近文章 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">最近文章</h3>
          <button 
            onClick={() => onNavigate('articles')} 
            className="text-[#D4AF37] hover:underline text-sm font-medium cursor-pointer"
          >
            查看全部
          </button>
        </div>
        <div className="space-y-4">
          {posts.slice(0, 5).map(post => (
            <div key={post.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              {post.featuredImage && (
                <img src={post.featuredImage} alt="" className="w-12 h-12 object-cover rounded-lg" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{post.title}</p>
                <p className="text-sm text-gray-500">{post.category}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 主管理组件
const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated, posts } = useBlog();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setAuthenticated(false);
    toast.success('已退出登录');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard' as AdminTab, icon: 'fa-chart-pie', label: '仪表盘' },
    { id: 'articles' as AdminTab, icon: 'fa-file-lines', label: '文章管理' },
    { id: 'inquiries' as AdminTab, icon: 'fa-envelope', label: '客户询价' },
    { id: 'subscribers' as AdminTab, icon: 'fa-users', label: '订阅管理' },
    { id: 'chat' as AdminTab, icon: 'fa-comments', label: '在线客服' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#1a1a2e] text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="font-semibold">CN-SpecLube</p>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-[#D4AF37] text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 底部操作 */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors mb-2"
          >
            <i className={`fa-solid fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* 顶部栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(m => m.id === activeTab)?.label || '管理后台'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors" title="访问网站">
              <i className="fa-solid fa-external-link"></i>
            </Link>
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard posts={posts} onNavigate={setActiveTab} />}
          
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">文章管理</h2>
                <button 
                  onClick={() => navigate('/admin/new')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors"
                >
                  <i className="fa-solid fa-plus"></i>
                  新建文章
                </button>
              </div>
              <ArticleList onEdit={(id) => navigate(`/admin/edit/${id}`)} />
            </div>
          )}
          
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">客户询价</h2>
              <InquiriesAdmin />
            </div>
          )}
          
          {activeTab === 'subscribers' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-12">
                <i className="fa-solid fa-users text-5xl text-[#D4AF37] mb-6"></i>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">订阅管理</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  管理邮件订阅用户，查看订阅统计，发送新闻通讯。
                </p>
                <Link
                  to="/admin/subscribers"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                  进入订阅管理
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'chat' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-12">
                <i className="fa-solid fa-comments text-5xl text-[#D4AF37] mb-6"></i>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">在线客服</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  管理客户对话，回复咨询消息。
                </p>
                <Link
                  to="/admin/chat"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                  进入客服工作台
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// 文章编辑组件 - 类似微信公众号/今日头条风格
export const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const location = window.location.pathname;
  const isNewArticle = location === '/admin/new';
  const { getPostById, addPost, updatePost, isLoading: blogLoading, posts } = useBlog();
  const [postData, setPostData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Industry News',
    tags: [],
    featuredImage: '',
    author: 'admin'
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showFeatureImageLibrary, setShowFeatureImageLibrary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 新建文章时直接设置 dataLoaded
    if (isNewArticle) {
      setDataLoaded(true);
      return;
    }
    
    // 编辑文章时需要等待数据加载
    if (blogLoading) return;
    
    // 确保有文章数据
    if (!posts.length) {
      console.log('ArticleEditor: No posts available yet');
      return;
    }
    
    if (id) {
      console.log('ArticleEditor: Looking for article with id:', id);
      console.log('ArticleEditor: Available posts:', posts.map(p => p.id));
      const post = getPostById(id);
      if (post) {
        console.log('ArticleEditor: Found article:', post.title);
        setPostData(post);
        setDataLoaded(true);
      } else {
        console.log('ArticleEditor: Article not found for id:', id);
        toast.error('未找到该文章');
        navigate('/admin');
      }
    }
  }, [id, getPostById, navigate, blogLoading, posts, isNewArticle]);

  // 显示加载状态 - 新建文章不需要等待加载
  if (!isNewArticle && (blogLoading || !dataLoaded)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setPostData(prev => ({ ...prev, content }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags?.includes(tagInput.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postData.title?.trim()) {
      toast.error('请输入文章标题');
      return;
    }
    if (!postData.content?.trim() || postData.content === '<p><br></p>') {
      toast.error('请输入文章内容');
      return;
    }
    if (!postData.excerpt?.trim()) {
      toast.error('请输入文章摘要');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        if (isNewArticle) {
          addPost(postData as Omit<BlogPost, 'id' | 'publishedAt'>);
          toast.success('文章创建成功');
        } else if (id) {
          const success = updatePost(id, postData);
          if (success) {
            toast.success('文章更新成功');
          } else {
            toast.error('更新失败，请重试');
          }
        }
        navigate('/admin');
      } catch (error) {
        toast.error('保存失败，请重试');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleCancel = () => {
    if (window.confirm('确定要放弃编辑吗？未保存的内容将会丢失。')) {
      navigate('/admin');
    }
  };

  // 从内容中自动生成摘要
  const generateExcerpt = () => {
    const text = postData.content?.replace(/<[^>]*>/g, '').trim() || '';
    const excerpt = text.substring(0, 150) + (text.length > 150 ? '...' : '');
    setPostData(prev => ({ ...prev, excerpt }));
    toast.success('已自动生成摘要');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部操作栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {isNewArticle ? '新建文章' : '编辑文章'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <i className={`fa-solid fa-${isPreview ? 'edit' : 'eye'} mr-2`}></i>
              {isPreview ? '编辑' : '预览'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  保存中
                </span>
              ) : '保存'}
            </button>
          </div>
        </div>
      </header>

      {/* 编辑区域 */}
      <div className="max-w-6xl mx-auto p-6">
        {isPreview ? (
          /* 预览模式 */
          <div className="bg-white rounded-xl shadow-sm p-8">
            <article className="prose prose-lg max-w-none">
              {postData.featuredImage && (
                <img src={postData.featuredImage} alt="" className="w-full h-64 object-cover rounded-lg mb-6" />
              )}
              <h1>{postData.title || '无标题'}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>{postData.category}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              {postData.tags && postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {postData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-lg text-gray-600 mb-6">{postData.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: postData.content || '' }} />
            </article>
          </div>
        ) : (
          /* 编辑模式 - 类似微信公众号 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：主要编辑区域 */}
            <div className="lg:col-span-2 space-y-4">
              {/* 标题输入 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <input
                  type="text"
                  name="title"
                  value={postData.title || ''}
                  onChange={handleChange}
                  placeholder="请输入文章标题..."
                  className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
              </div>

              {/* 富文本编辑器 */}
              <RichTextEditor
                value={postData.content || ''}
                onChange={handleContentChange}
                placeholder="开始撰写您的文章内容..."
              />
            </div>

            {/* 右侧：设置面板 */}
            <div className="space-y-4">
              {/* 发布设置 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-gear text-[#D4AF37]"></i>
                  发布设置
                </h3>
                
                <div className="space-y-4">
                  {/* 分类 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">文章分类</label>
                    <select
                      name="category"
                      value={postData.category || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="Industry News">Industry News</option>
                      <option value="Technical Information">Technical Information</option>
                      <option value="Market Analysis">Market Analysis</option>
                      <option value="Product Updates">Product Updates</option>
                    </select>
                  </div>

                  {/* 标签 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">文章标签</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="输入标签后回车添加"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C9A227] transition-colors"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postData.tags?.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-900 ml-1"
                          >
                            <i className="fa-solid fa-times text-xs"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 特色图片 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-image text-[#D4AF37]"></i>
                  特色图片
                </h3>
                
                {/* 图片预览和选择 */}
                {postData.featuredImage ? (
                  <div className="relative group mb-3">
                    <img 
                      src={postData.featuredImage} 
                      alt="" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowFeatureImageLibrary(true)}
                        className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
                      >
                        更换
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostData(prev => ({ ...prev, featuredImage: '' }))}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowFeatureImageLibrary(true)}
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                  >
                    <i className="fa-solid fa-cloud-upload text-3xl mb-2"></i>
                    <span className="text-sm">点击选择图片</span>
                  </button>
                )}
                
                {/* 或输入URL */}
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">或直接输入图片URL：</p>
                  <input
                    type="text"
                    name="featuredImage"
                    value={postData.featuredImage || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* 文章摘要 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <i className="fa-solid fa-align-left text-[#D4AF37]"></i>
                    文章摘要
                  </h3>
                  <button
                    type="button"
                    onClick={generateExcerpt}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    自动生成
                  </button>
                </div>
                <textarea
                  name="excerpt"
                  value={postData.excerpt || ''}
                  onChange={handleChange}
                  placeholder="简要描述文章内容（用于列表展示）..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                ></textarea>
                <p className="text-xs text-gray-400 mt-2">建议150字以内</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 封面图图片库弹窗 */}
      <ImageLibrary
        isOpen={showFeatureImageLibrary}
        onClose={() => setShowFeatureImageLibrary(false)}
        onSelect={(url) => {
          setPostData(prev => ({ ...prev, featuredImage: url }));
          setShowFeatureImageLibrary(false);
        }}
      />
    </div>
  );
};

export default Admin;
