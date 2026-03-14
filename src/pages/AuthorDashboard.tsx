import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Author {
  id: string;
  name: string;
  display_name: string;
  email: string;
  phone?: string;
  username: string;
  company: string;
  bio: string;
  expertise_areas: string[];
  avatar_url: string;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'settings'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    display_name: '',
    username: '',
    company: '',
    bio: '',
    expertise_areas: '' as string,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Bind email state
  const [showBindEmailModal, setShowBindEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Bind phone state
  const [showBindPhoneModal, setShowBindPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    // 检查登录状态
    const authorData = localStorage.getItem('author');
    if (!authorData) {
      navigate('/author/login');
      return;
    }

    const authorObj = JSON.parse(authorData);
    setAuthor(authorObj);
    setSettingsForm({
      display_name: authorObj.display_name || authorObj.name || '',
      username: authorObj.username || '',
      company: authorObj.company || '',
      bio: authorObj.bio || '',
      expertise_areas: (authorObj.expertise_areas || []).join(', '),
    });
    loadAuthorData(authorObj.id);
  }, [navigate]);

  const loadAuthorData = async (authorId: string) => {
    try {
      // 获取作者最新信息
      const authorRes = await fetch(`/api/author/${authorId}`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        if (authorData.success) {
          const updatedAuthor = authorData.author;
          setAuthor(updatedAuthor);
          setSettingsForm({
            display_name: updatedAuthor.display_name || updatedAuthor.name || '',
            username: updatedAuthor.username || '',
            company: updatedAuthor.company || '',
            bio: updatedAuthor.bio || '',
            expertise_areas: (updatedAuthor.expertise_areas || []).join(', '),
          });
          localStorage.setItem('author', JSON.stringify(updatedAuthor));
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // 验证文件大小 (最大 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload image');
      }

      // 更新头像URL
      const avatarUrl = uploadData.url;
      const updateRes = await fetch(`/api/author/${author?.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: avatarUrl }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        setAuthor(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
        toast.success('Avatar updated successfully');
        loadAuthorData(author!.id);
      } else {
        throw new Error(updateData.error || 'Failed to update avatar');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSettingsSave = async () => {
    if (!settingsForm.username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (settingsForm.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(settingsForm.username)) {
      toast.error('Username can only contain letters, numbers, and underscores');
      return;
    }

    setSaving(true);
    try {
      const expertiseArray = settingsForm.expertise_areas
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await fetch(`/api/author/${author?.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: settingsForm.display_name || author?.name,
          username: settingsForm.username,
          company: settingsForm.company,
          bio: settingsForm.bio,
          expertise_areas: expertiseArray,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAuthor(data.author);
        localStorage.setItem('author', JSON.stringify(data.author));
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/author/${author?.id}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Password changed successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Bind email functions
  const handleSendBindEmailCode = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (newEmail === author?.email) {
      toast.error('This email is already bound to your account');
      return;
    }

    setSendingCode(true);
    try {
      const response = await fetch(`/api/author/${author?.id}/send-bind-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Verification code sent to your email');
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleBindEmail = async () => {
    if (!emailCode || emailCode.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }

    setVerifyingCode(true);
    try {
      const response = await fetch(`/api/author/${author?.id}/bind-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, code: emailCode }),
      });

      const data = await response.json();
      if (data.success) {
        setAuthor(data.author);
        localStorage.setItem('author', JSON.stringify(data.author));
        toast.success('Email bound successfully');
        setShowBindEmailModal(false);
        setNewEmail('');
        setEmailCode('');
        setCountdown(0);
      } else {
        toast.error(data.error || 'Failed to bind email');
      }
    } catch (error) {
      toast.error('Failed to bind email');
    } finally {
      setVerifyingCode(false);
    }
  };

  // Bind phone functions
  const handleBindPhone = async () => {
    if (!newPhone || newPhone.length < 6) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/author/${author?.id}/bind-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone }),
      });

      const data = await response.json();
      if (data.success) {
        setAuthor(data.author);
        localStorage.setItem('author', JSON.stringify(data.author));
        toast.success('Phone bound successfully');
        setShowBindPhoneModal(false);
        setNewPhone('');
      } else {
        toast.error(data.error || 'Failed to bind phone');
      }
    } catch (error) {
      toast.error('Failed to bind phone');
    } finally {
      setSaving(false);
    }
  };

  const handleUnbindPhone = async () => {
    if (!confirm('Are you sure you want to unbind your phone number?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/author/${author?.id}/phone`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setAuthor(data.author);
        localStorage.setItem('author', JSON.stringify(data.author));
        toast.success('Phone unbound successfully');
      } else {
        toast.error(data.error || 'Failed to unbind phone');
      }
    } catch (error) {
      toast.error('Failed to unbind phone');
    } finally {
      setSaving(false);
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
              <div className="flex items-center gap-3">
                {author.avatar_url ? (
                  <img src={author.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {(author.display_name || author.name || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-slate-600">Welcome, <strong>{author.display_name || author.name}</strong></span>
              </div>
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
            { id: 'settings', label: 'Settings', icon: 'fa-gear' },
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
                    <Link to="/author/write" className="inline-block mt-4 px-4 py-2 bg-[#D4AF37] text-white rounded-lg">
                      Write Article
                    </Link>
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
                to="/author/write"
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

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            {/* 头像设置 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {author.avatar_url ? (
                    <img 
                      src={author.avatar_url} 
                      alt="" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-[#003366] to-[#004080] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {(author.display_name || author.name || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    onClick={handleAvatarClick}
                    disabled={uploadingAvatar}
                    className="px-4 py-2 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#002255] transition-colors disabled:opacity-50"
                  >
                    <i className="fa-solid fa-camera mr-2"></i>
                    {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                  </button>
                  <p className="text-sm text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={settingsForm.display_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, display_name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Your display name"
                    />
                    <p className="text-xs text-slate-500 mt-1">This name will be shown on your articles</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={settingsForm.username}
                      onChange={(e) => setSettingsForm({ ...settingsForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="username"
                    />
                    <p className="text-xs text-slate-500 mt-1">Only letters, numbers, and underscores</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={author.email}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Contact admin to change email</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={settingsForm.company}
                    onChange={(e) => setSettingsForm({ ...settingsForm, company: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expertise Areas</label>
                  <input
                    type="text"
                    value={settingsForm.expertise_areas}
                    onChange={(e) => setSettingsForm({ ...settingsForm, expertise_areas: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="Transformer Oil, Lubricants, Hydraulic Fluids"
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate with commas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  <textarea
                    value={settingsForm.bio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                    rows={3}
                    placeholder="A brief introduction about yourself..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSettingsSave}
                  disabled={saving}
                  className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* 安全设置 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Security</h2>
              
              {!showPasswordSection ? (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <i className="fa-solid fa-key mr-2"></i>Change Password
                </button>
              ) : (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="px-4 py-2 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#002255] disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 联系方式绑定 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Contact Binding</h2>
              <div className="space-y-4">
                {/* 邮箱绑定 */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-envelope text-blue-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <p className="text-sm text-slate-500">
                        {author.email || 'Not bound'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBindEmailModal(true)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors text-sm"
                  >
                    {author.email ? 'Change Email' : 'Bind Email'}
                  </button>
                </div>

                {/* 手机号绑定 */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-phone text-green-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      <p className="text-sm text-slate-500">
                        {author.phone || 'Not bound'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {author.phone && (
                      <button
                        onClick={handleUnbindPhone}
                        disabled={saving}
                        className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
                      >
                        Unbind
                      </button>
                    )}
                    <button
                      onClick={() => setShowBindPhoneModal(true)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors text-sm"
                    >
                      {author.phone ? 'Change Phone' : 'Bind Phone'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 账户信息 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Real Name:</span>
                  <span className="ml-2 text-slate-900 font-medium">{author.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Member Since:</span>
                  <span className="ml-2 text-slate-900 font-medium">
                    {new Date(author.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bind Email Modal */}
      {showBindEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Bind Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="6-digit code"
                    maxLength={6}
                  />
                  <button
                    onClick={handleSendBindEmailCode}
                    disabled={sendingCode || countdown > 0 || !newEmail}
                    className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002255] disabled:opacity-50 whitespace-nowrap text-sm"
                  >
                    {sendingCode ? 'Sending...' : countdown > 0 ? `${countdown}s` : 'Send Code'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowBindEmailModal(false);
                  setNewEmail('');
                  setEmailCode('');
                  setCountdown(0);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBindEmail}
                disabled={verifyingCode || !emailCode}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] disabled:opacity-50 flex items-center gap-2"
              >
                {verifyingCode && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Bind Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bind Phone Modal */}
      {showBindPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Bind Phone</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="+86 138 0000 0000"
                />
                <p className="text-xs text-slate-500 mt-1">Include country code, e.g., +86, +1, +44</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowBindPhoneModal(false);
                  setNewPhone('');
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBindPhone}
                disabled={saving || !newPhone}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Bind Phone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
