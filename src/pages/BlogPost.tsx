import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';
import { toast } from 'sonner';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, getPostById, isAuthenticated } = useBlog();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 提取文章中的第一张图片作为og:image
  useEffect(() => {
    // 可以在这里添加SEO相关的meta标签设置
  }, [post]);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        toast.error('未找到该文章');
        navigate('/blog');
      }
    }
    setIsLoading(false);
  }, [id, getPostById, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-[#D4AF37] mb-4"></i>
          <p className="text-xl text-[#333333]">加载中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-circle text-4xl text-[#D4AF37] mb-4"></i>
          <p className="text-xl text-[#333333]">文章不存在</p>
          <Link 
            to="/blog"
            className="mt-4 inline-block bg-[#003366] text-white px-6 py-2 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            返回博客首页
          </Link>
        </div>
      </div>
    );
  }

  // 格式化日期
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* 面包屑导航 */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="text-[#333333] hover:text-[#003366]">首页</Link></li>
            <li><i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i></li>
            <li><Link to="/blog" className="text-[#333333] hover:text-[#003366]">博客</Link></li>
            <li><i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i></li>
            <li><span className="text-[#D4AF37]">{post.category}</span></li>
          </ol>
        </nav>
        
        {/* 文章内容 */}
        <div className="max-w-3xl mx-auto">
          {/* 文章标题和元信息 */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-[#003366] text-white text-sm rounded-sm">{post.category}</span>
              {post.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-[#F4F6F9] text-[#003366] text-sm rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--primary-brand)] font-['Montserrat'] tracking-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-500 text-sm">
                <span className="mr-4">{formattedDate}</span>
                <span>Author: {post.author}</span>
              </div>
          </div>
          
          {/* 特色图片 */}
          <div className="mb-12">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-auto rounded-sm shadow-md"
            />
          </div>
          
          {/* 文章内容 */}
          <div 
            className="prose prose-lg max-w-none text-[#333333] mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* 管理员操作按钮 */}
          {isAuthenticated() && (
            <div className="flex gap-4 mb-12">
              <Link 
                to={`/admin/edit/${post.id}`}
                className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                     <i className="fa-solid fa-pen-to-square mr-2"></i>Edit Article
                   </Link>
              <button
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-sm font-semibold hover:bg-opacity-90 transition-all"
                onClick={() => {
                  if (window.confirm('确定要删除这篇文章吗？')) {
                    // 删除文章的逻辑在Admin组件中处理
                    navigate('/admin');
                  }
                }}
              >
                     <i className="fa-solid fa-trash mr-2"></i>Delete Article
                   </button>
            </div>
          )}
          
          {/* 相关文章 */}
          <div className="border-t border-gray-200 pt-12">
               <h2 className="text-2xl font-bold mb-6 text-[#003366] font-['Montserrat']">
                 Related Articles
               </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts
                .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
                .slice(0, 2)
                .map(relatedPost => (
                  <div key={relatedPost.id} className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={relatedPost.featuredImage} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#003366] mb-2 line-clamp-2">
                        <Link to={`/blog/${relatedPost.id}`} className="hover:underline">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(relatedPost.publishedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* 返回博客首页 */}
          <div className="mt-12 text-center">
            <Link 
              to="/blog"
              className="inline-block border-2 border-[#003366] text-[#003366] px-8 py-3 rounded-sm font-semibold hover:bg-[#003366] hover:text-white transition-all"
            >
                     Back to Blog
                   </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex">
        <a href="tel:+8612345678910" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>联系我们</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default BlogPost;