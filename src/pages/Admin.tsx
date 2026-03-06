import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { toast } from 'sonner';
import { useBlog } from '../hooks/useBlog';
import { BlogPost } from '../types/blog';

// 文章列表组件
const ArticleList = () => {
  const { posts, deletePost } = useBlog();
  const navigate = useNavigate();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the article "${title}"?`)) {
      const success = deletePost(id);
      if (success) {
        toast.success('Article deleted successfully');
      } else {
        toast.error('Failed to delete article, please try again');
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#003366] text-white">
            <th className="p-4 text-left font-semibold">Title</th>
            <th className="p-4 text-left font-semibold">Category</th>
            <th className="p-4 text-left font-semibold">Published Date</th>
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr 
                key={post.id} 
                className="bg-white hover:bg-[#F4F6F9] transition-colors"
              >
                <td className="p-4 border-b border-gray-200 max-w-xs overflow-hidden">
                  <div className="font-medium text-[#003366] truncate">{post.title}</div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <span className="px-2 py-1 bg-[#F4F6F9] text-[#003366] text-sm rounded-sm">{post.category}</span>
                </td>
                <td className="p-4 border-b border-gray-200 text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/admin/edit/${post.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-sm hover:bg-opacity-90 transition-all"
                    >
                      <i className="fa-solid fa-pen-to-square mr-1"></i>Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id, post.title)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-sm hover:bg-opacity-90 transition-all"
                    >
                      <i className="fa-solid fa-trash mr-1"></i>Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                <i className="fa-solid fa-file-circle-exclamation text-2xl mb-2"></i>
                <p>No articles yet, please create a new article</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated } = useBlog();

  // 检查是否已登录
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

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* 页面头部 */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center">
          <div>
              <h1 className="text-3xl font-bold text-[#003366] font-['Montserrat']">
                Blog Admin Panel
              </h1>
              <p className="text-[#333333]">Manage your blog articles</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 inline-block bg-red-600 text-white px-6 py-2 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
          >
                     <i className="fa-solid fa-sign-out-alt mr-2"></i>Logout
          </button>
        </header>

        {/* 管理内容区域 */}
        <div className="bg-[#F4F6F9] p-8 rounded-sm mb-12">
          <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-bold text-[#003366] font-['Montserrat']">
                 Article Management
               </h2>
            <button 
              onClick={() => navigate('/admin/new')}
              className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
            >
                     <i className="fa-solid fa-plus mr-2"></i>New Article
            </button>
          </div>
          
          {/* 文章列表 */}
          <ArticleList />
        </div>
      </div>
    </div>
  );
};

// 文章编辑组件
export const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, addPost, updatePost } = useBlog();
  const [postData, setPostData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: '产业动态',
    tags: [] as string[],
    featuredImage: '',
    author: 'admin'
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 加载文章数据（编辑模式）
  useEffect(() => {
    if (id && id !== 'new') {
      const post = getPostById(id);
      if (post) {
        setPostData(post);
      } else {
        toast.error('未找到该文章');
        navigate('/admin');
      }
    }
  }, [id, getPostById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
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
    
    // 表单验证
    if (!postData.title?.trim()) {
      toast.error('请输入文章标题');
      return;
    }
    if (!postData.content?.trim()) {
      toast.error('请输入文章内容');
      return;
    }
    if (!postData.excerpt?.trim()) {
      toast.error('请输入文章摘要');
      return;
    }
    if (!postData.featuredImage?.trim()) {
      toast.error('请输入特色图片URL');
      return;
    }

    setIsLoading(true);

    // 模拟保存延迟
    setTimeout(() => {
      try {
        if (id === 'new') {
          // 创建新文章
          addPost(postData as Omit<BlogPost, 'id' | 'publishedAt'>);
          toast.success('文章创建成功');
        } else {
          // 更新文章
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
        console.error('Save error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleCancel = () => {
    if (window.confirm('确定要放弃编辑吗？未保存的内容将会丢失。')) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* 面包屑导航 */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li><a href="/admin" className="text-[#333333] hover:text-[#003366]">后台管理</a></li>
            <li><i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i></li>
            <li><span className="text-[#D4AF37]">{id === 'new' ? '新建文章' : '编辑文章'}</span></li>
          </ol>
        </nav>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[#003366] font-['Montserrat']">
                 {id === 'new' ? 'New Article' : 'Edit Article'}
          </h1>
          
          <div className="bg-[#F4F6F9] p-8 rounded-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 文章标题 */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#222222] mb-2">
                  文章标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={postData.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  placeholder="请输入文章标题"
                  maxLength={100}
                />
              </div>
              
              {/* 文章分类 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#222222] mb-2">
                  文章分类 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={postData.category || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                >
                  <option value="产业动态">产业动态</option>
                  <option value="技术应用">技术应用</option>
                  <option value="产品介绍">产品介绍</option>
                  <option value="行业知识">行业知识</option>
                  <option value="企业新闻">企业新闻</option>
                </select>
              </div>
              
              {/* 文章标签 */}
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">
                  文章标签
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                    placeholder="输入标签后按回车添加"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#003366] text-white rounded-sm font-medium hover:bg-opacity-90 transition-all"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {postData.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[#003366] text-white text-sm rounded-sm flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-xs hover:text-gray-200"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 特色图片 */}
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-[#222222] mb-2">
                  特色图片 URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="featuredImage"
                  name="featuredImage"
                  value={postData.featuredImage || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  placeholder="请输入图片URL"
                />
                {postData.featuredImage && (
                  <div className="mt-4 p-2 border border-gray-200 rounded-sm">
                    <img 
                      src={postData.featuredImage} 
                      alt="Preview" 
                      className="max-w-full h-auto max-h-64 object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* 文章摘要 */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-[#222222] mb-2">
                  文章摘要 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={postData.excerpt || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  placeholder="请输入文章摘要（用于博客列表展示）"
                ></textarea>
              </div>
              
              {/* 文章内容 */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-[#222222] mb-2">
                  文章内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={postData.content || ''}
                  onChange={handleChange}
                  rows={12}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  placeholder="请输入文章内容（支持HTML标签）"
                ></textarea>
                <p className="mt-2 text-xs text-gray-500">
                   Tip: You can use HTML tags in the content, such as &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;img&gt;, etc.
                </p>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-[#333333] rounded-sm font-semibold hover:bg-gray-100 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      保存中...
                    </span>
                  ) : (
                    '保存文章'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;