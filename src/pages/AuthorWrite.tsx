import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import RichTextEditor from '../components/RichTextEditor';
import ImageLibrary from '../components/ImageLibrary';

interface Author {
  id: number;
  username: string;
  display_name: string;
  email: string;
  avatar_url?: string;
}

interface PostData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
}

const AuthorWrite = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [postData, setPostData] = useState<PostData>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Industry News',
    tags: [],
    featuredImage: ''
  });

  // 分类选项
  const categories = [
    'Industry News',
    'Technical Information',
    'Market Analysis',
    'Product Updates'
  ];

  useEffect(() => {
    // 检查登录状态
    const authorData = localStorage.getItem('authorInfo');
    if (!authorData) {
      navigate('/author/login');
      return;
    }
    
    try {
      const author = JSON.parse(authorData);
      setAuthor(author);
    } catch {
      localStorage.removeItem('authorInfo');
      navigate('/author/login');
    }
  }, [navigate]);

  // 自动生成摘要
  useEffect(() => {
    if (postData.content && !postData.excerpt) {
      const plainText = postData.content.replace(/<[^>]*>/g, '').substring(0, 150);
      if (plainText.length >= 150) {
        setPostData(prev => ({ ...prev, excerpt: plainText + '...' }));
      }
    }
  }, [postData.content, postData.excerpt]);

  // 添加标签
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !postData.tags.includes(tag) && postData.tags.length < 5) {
      setPostData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 选择封面图
  const handleSelectImage = (url: string) => {
    setPostData(prev => ({ ...prev, featuredImage: url }));
    setShowImageLibrary(false);
  };

  // 提交文章
  const handleSubmit = async (isDraft = false) => {
    // 验证必填字段
    if (!postData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!postData.content.trim()) {
      toast.error('Please enter content');
      return;
    }
    if (!postData.excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/author/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          author_id: author?.id,
          review_status: isDraft ? 'draft' : 'pending'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isDraft ? 'Draft saved successfully' : 'Article submitted for review');
        navigate('/author/dashboard');
      } else {
        toast.error(result.error || 'Failed to submit article');
      }
    } catch (error) {
      toast.error('Failed to submit article');
    } finally {
      setIsLoading(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    // 如果有内容，显示确认对话框
    if (postData.title || postData.content) {
      setShowCancelConfirm(true);
    } else {
      navigate('/author/dashboard');
    }
  };

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
              <Link to="/author/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <i className={`fa-solid ${isPreview ? 'fa-pen' : 'fa-eye'} mr-2`}></i>
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreview ? (
          /* 预览模式 */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {postData.featuredImage && (
              <div className="aspect-video relative">
                <img 
                  src={postData.featuredImage} 
                  alt={postData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium">
                  {postData.category}
                </span>
                <span className="text-slate-400 text-sm">
                  By {author.display_name}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{postData.title || 'Untitled'}</h1>
              <p className="text-lg text-slate-600 mb-6">{postData.excerpt}</p>
              {postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {postData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: postData.content || '<p class="text-slate-400">No content yet...</p>' }}
              />
            </div>
          </div>
        ) : (
          /* 编辑模式 */
          <div className="space-y-6">
            {/* 封面图 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Cover Image
              </label>
              {postData.featuredImage ? (
                <div className="relative group">
                  <img 
                    src={postData.featuredImage} 
                    alt="Cover"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                    <button
                      onClick={() => setShowImageLibrary(true)}
                      className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => setPostData(prev => ({ ...prev, featuredImage: '' }))}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowImageLibrary(true)}
                  className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors"
                >
                  <i className="fa-solid fa-image text-3xl mb-2"></i>
                  <span>Add cover image</span>
                </button>
              )}
            </div>

            {/* 标题 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <input
                type="text"
                placeholder="Article title..."
                value={postData.title}
                onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-2xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* 摘要 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Brief description of your article (max 200 characters)..."
                value={postData.excerpt}
                onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value.substring(0, 200) }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">{postData.excerpt.length}/200 characters</p>
            </div>

            {/* 分类和标签 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 分类 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Category
                </label>
                <select
                  value={postData.category}
                  onChange={(e) => setPostData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 标签 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tags (max 5)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {postData.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    disabled={postData.tags.length >= 5}
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || postData.tags.length >= 5}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* 内容编辑器 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Content
              </label>
              <RichTextEditor
                value={postData.content}
                onChange={(value) => setPostData(prev => ({ ...prev, content: value }))}
                placeholder="Write your article content here..."
              />
            </div>

            {/* 提示信息 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-info-circle text-amber-500 mt-0.5"></i>
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Review Process</p>
                  <p>After submission, your article will be reviewed by our editorial team. You will be notified once it's approved and published.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 图片库弹窗 */}
      <ImageLibrary 
        isOpen={showImageLibrary} 
        onClose={() => setShowImageLibrary(false)} 
        onSelect={handleSelectImage} 
      />

      {/* 取消确认弹窗 */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Discard Changes?</h3>
            <p className="text-slate-600 mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Keep Editing
              </button>
              <button
                onClick={() => navigate('/author/dashboard')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorWrite;
