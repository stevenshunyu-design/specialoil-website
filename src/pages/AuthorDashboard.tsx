import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Author {
  id: string;
  name: string;
  email: string;
  username: string;
  company: string;
  expertise_areas: string[];
  articles_count: number;
  total_views: number;
  total_likes: number;
  created_at: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  review_status: string;
  publishedAt: string;
  view_count: number;
  like_count: number;
}

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'profile'>('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    // 检查登录状态
    const authorData = localStorage.getItem('author');
    if (!authorData) {
      navigate('/author/login');
      return;
    }

    const authorObj = JSON.parse(authorData);
    setAuthor(authorObj);
    loadAuthorData(authorObj.id);
  }, [navigate]);

  const loadAuthorData = async (authorId: string) => {
    try {
      // 获取作者最新信息
      const authorRes = await fetch(`/api/author/${authorId}`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        if (authorData.success) {
          setAuthor(authorData.author);
          localStorage.setItem('author', JSON.stringify(authorData.author));
        }
      }

      // 获取文章列表
      const articlesRes = await fetch(`/api/author/${authorId}/articles`);
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        if (articlesData.success) {
          setArticles(articlesData.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load author data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('author');
    navigate('/author/login');
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`/api/author/${author?.id}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password changed successfully');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#004080] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SO</span>
                </div>
                <span className="text-xl font-bold text-[#003366]">Author Portal</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Welcome, <strong>{author.name}</strong></span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签页导航 */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
            { id: 'articles', label: 'My Articles', icon: 'fa-file-lines' },
            { id: 'profile', label: 'Profile', icon: 'fa-user' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Articles</p>
                    <p className="text-3xl font-bold text-slate-900">{author.articles_count}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-file-lines text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Views</p>
                    <p className="text-3xl font-bold text-slate-900">{author.total_views.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-eye text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Likes</p>
                    <p className="text-3xl font-bold text-slate-900">{author.total_likes}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-heart text-red-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近文章 */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Recent Articles</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {articles.slice(0, 5).map((article) => (
                  <div key={article.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900 mb-1">{article.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{article.excerpt}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(article.review_status)}`}>
                        {article.review_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span><i className="fa-solid fa-eye mr-1"></i> {article.view_count || 0}</span>
                      <span><i className="fa-solid fa-heart mr-1"></i> {article.like_count || 0}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {articles.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <i className="fa-solid fa-file-circle-plus text-4xl mb-4 opacity-50"></i>
                    <p>No articles yet. Start writing your first article!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">My Articles</h2>
              <Link
                to="/admin/new"
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <i className="fa-solid fa-plus mr-2"></i>New Article
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Views</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{article.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(article.review_status)}`}>
                          {article.review_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{article.view_count || 0}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {articles.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  <i className="fa-solid fa-file-circle-plus text-4xl mb-4 opacity-50"></i>
                  <p>No articles yet. Start writing your first article!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Name</label>
                    <p className="text-slate-900 font-medium">{author.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Username</label>
                    <p className="text-slate-900 font-medium">{author.username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Email</label>
                    <p className="text-slate-900 font-medium">{author.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Company</label>
                    <p className="text-slate-900 font-medium">{author.company || '-'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Expertise Areas</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {author.expertise_areas?.map((area) => (
                      <span key={area} className="px-3 py-1 bg-[#003366] text-white rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                    {(!author.expertise_areas || author.expertise_areas.length === 0) && (
                      <span className="text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Member Since</label>
                  <p className="text-slate-900 font-medium">
                    {new Date(author.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-md font-semibold text-slate-900 mb-4">Security</h3>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <i className="fa-solid fa-key mr-2"></i>Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 修改密码弹窗 */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '' });
                }}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-lg font-medium hover:shadow-lg"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
