import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';
import { toast } from 'sonner';
import ConfirmDialog from '../components/ui/ConfirmDialog';

// 阅读进度条组件
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-[#003366] to-[#D4AF37] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// 作者信息卡片
const AuthorCard = ({ author }: { author: string }) => {
  const authorInfo: Record<string, { name: string; title: string; avatar: string; bio: string }> = {
    'Technical Team': {
      name: 'Technical Team',
      title: 'Senior Technical Analyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Expert in China special oil industry with over 15 years of experience in technical analysis and market research.'
    },
    'Market Research Team': {
      name: 'Market Research Team',
      title: 'Industry Analyst',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Specialized in analyzing China petroleum and special oil market trends and competitive landscape.'
    },
    'Sustainability Team': {
      name: 'Sustainability Team',
      title: 'Environmental Specialist',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'Focus on sustainable development and environmental compliance in the oil industry.'
    },
    'Compliance Team': {
      name: 'Compliance Team',
      title: 'Regulatory Affairs Expert',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      bio: 'Expert in international trade regulations and compliance requirements for oil products.'
    }
  };

  const info = authorInfo[author] || authorInfo['Technical Team'];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <img 
          src={info.avatar} 
          alt={info.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-[#003366] text-lg">{info.name}</h4>
          <p className="text-sm text-[#D4AF37] font-medium mb-2">{info.title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{info.bio}</p>
        </div>
      </div>
    </div>
  );
};

// 分享按钮组件
const ShareButtons = ({ title, url }: { title: string; url: string }) => {
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Share:</span>
      <a 
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-all duration-300"
      >
        <i className="fa-brands fa-twitter text-sm"></i>
      </a>
      <a 
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#0077B5] hover:text-white flex items-center justify-center transition-all duration-300"
      >
        <i className="fa-brands fa-linkedin-in text-sm"></i>
      </a>
      <a 
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#4267B2] hover:text-white flex items-center justify-center transition-all duration-300"
      >
        <i className="fa-brands fa-facebook-f text-sm"></i>
      </a>
      <button 
        onClick={copyToClipboard}
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#003366] hover:text-white flex items-center justify-center transition-all duration-300"
      >
        <i className="fa-solid fa-link text-sm"></i>
      </button>
    </div>
  );
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, getPostById, isAuthenticated, isLoading: blogLoading, deletePost } = useBlog();
  const [post, setPost] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // 当 id 变化时，加载对应的文章
  useEffect(() => {
    // 等待加载完成
    if (blogLoading) return;
    
    // 确保有文章数据
    if (!posts.length) {
      console.log('BlogPost: No posts available yet');
      return;
    }
    
    if (id) {
      console.log('BlogPost: Looking for article with id:', id);
      console.log('BlogPost: Available posts:', posts.map(p => p.id));
      const foundPost = getPostById(id);
      if (foundPost) {
        console.log('BlogPost: Found article:', foundPost.title);
        setPost(foundPost);
        window.scrollTo(0, 0);
      } else {
        console.log('BlogPost: Article not found for id:', id);
        toast.error('Article not found');
        navigate('/blog');
      }
    }
  }, [id, getPostById, navigate, blogLoading, posts]);

  // 显示加载状态（加载中或文章数据尚未准备好）
  if (blogLoading || (!post && posts.length === 0)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#003366] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-file-lines text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004d99] transition-all"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 使用文章数据中的 featuredImage 作为主图
  const articleImage = { 
    hero: post.featuredImage || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=600&fit=crop', 
    content: [] 
  };

  // 估算阅读时间
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image with Overlay */}
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
          <img 
            src={articleImage.hero} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-6 left-6">
            <span className="px-4 py-2 bg-[#D4AF37] text-white text-sm font-semibold rounded-full shadow-lg">
              {post.category}
            </span>
          </div>
          
          {/* Title and Meta */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 4).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight font-['Montserrat']">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar"></i>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-clock"></i>
                  <span>{readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-user"></i>
                  <span>{post.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar - Left */}
          <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Share Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <ShareButtons 
                  title={post.title} 
                  url={window.location.href}
                />
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-800 mb-4">Article Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reading Time</span>
                    <span className="font-medium text-gray-800">{readTime} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Words</span>
                    <span className="font-medium text-gray-800">{wordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-800">{post.category}</span>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="bg-gradient-to-br from-[#003366] to-[#004d99] rounded-xl p-5 text-white">
                <h4 className="font-bold mb-2 text-white">Need Expert Advice?</h4>
                <p className="text-sm text-white/80 mb-4">Contact our team for product inquiries and technical support.</p>
                <Link 
                  to="/contact"
                  className="block text-center bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c9a432] transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </aside>
          
          {/* Article Content */}
          <main className="flex-1 order-1 lg:order-2 max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center text-sm text-gray-500">
                <li><Link to="/" className="hover:text-[#003366] transition-colors">Home</Link></li>
                <li className="mx-2"><i className="fa-solid fa-chevron-right text-xs"></i></li>
                <li><Link to="/blog" className="hover:text-[#003366] transition-colors">Blog</Link></li>
                <li className="mx-2"><i className="fa-solid fa-chevron-right text-xs"></i></li>
                <li className="text-[#D4AF37] font-medium truncate max-w-[200px]">{post.category}</li>
              </ol>
            </nav>
            
            {/* Excerpt */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-transparent border-l-4 border-[#D4AF37] rounded-r-xl">
              <p className="text-lg text-gray-700 leading-relaxed italic">
                "{post.excerpt}"
              </p>
            </div>
            
            {/* Featured Content Image */}
            {articleImage.content[0] && (
              <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={articleImage.content[0]} 
                  alt="Article illustration"
                  className="w-full h-auto"
                />
              </div>
            )}
            
            {/* Article Body */}
            <article 
              ref={contentRef}
              className="prose prose-lg max-w-none 
                prose-headings:font-['Montserrat'] prose-headings:font-bold prose-headings:text-[#003366]
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-[#003366] prose-a:no-underline hover:prose-a:text-[#D4AF37]
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-li:my-2
                prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-md
                prose-th:bg-[#003366] prose-th:text-white prose-th:p-4
                prose-td:p-4 prose-td:border prose-td:border-gray-200
                prose-img:rounded-xl prose-img:shadow-lg
                "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Second Content Image */}
            {articleImage.content[1] && (
              <div className="my-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={articleImage.content[1]} 
                  alt="Article illustration"
                  className="w-full h-auto"
                />
              </div>
            )}
            
            {/* Tags */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <Link 
                    key={index}
                    to={`/blog?search=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-[#003366] hover:text-white transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Author Card */}
            <div className="mt-10">
              <AuthorCard author={post.author} />
            </div>
            
            {/* Admin Controls */}
            {isAuthenticated() && (
              <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-shield-halved text-yellow-600"></i>
                  <span className="text-sm text-yellow-800 font-medium">Admin Actions:</span>
                  <div className="flex gap-3 ml-auto">
                    <Link 
                      to={`/admin/edit/${post.id}`}
                      className="px-4 py-2 bg-white text-[#003366] rounded-lg text-sm font-medium hover:bg-gray-100 transition-all flex items-center gap-2"
                    >
                      <i className="fa-solid fa-pen"></i>
                      Edit
                    </Link>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all flex items-center gap-2"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <i className="fa-solid fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
          
          {/* Sidebar - Right (Table of Contents placeholder) */}
          <aside className="hidden xl:block w-64 flex-shrink-0 order-3">
            <div className="sticky top-8">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-list"></i>
                  On This Page
                </h4>
                <p className="text-sm text-gray-500">Scroll to explore the full article content.</p>
              </div>
            </div>
          </aside>
        </div>
        
        {/* Related Articles */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#003366] font-['Montserrat']">
              Related Articles
            </h2>
            <Link 
              to="/blog"
              className="text-[#003366] font-medium hover:text-[#D4AF37] transition-colors flex items-center gap-2"
            >
              View All
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts
              .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
              .slice(0, 3)
              .map(relatedPost => {
                return (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-semibold text-lg text-[#003366] mt-2 mb-3 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-400">
                        <i className="fa-regular fa-calendar mr-2"></i>
                        {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
        
        {/* Newsletter CTA */}
        <section className="mt-16 mb-8">
          <div className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-['Montserrat'] text-white">
                Stay Updated with Industry Insights
              </h3>
              <p className="text-white/80 mb-6">
                Subscribe to our newsletter for the latest China special oil market news, technical guides, and regulatory updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#c9a432] transition-all whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex shadow-lg">
        <a href="tel:+8613793280176" className="flex-1 py-4 bg-[#003366] text-white flex items-center justify-center font-medium">
          <i className="fa-solid fa-phone mr-2"></i>
          <span>Call Us</span>
        </a>
        <a href="https://wa.me/12345678910" className="flex-1 py-4 bg-[#D4AF37] text-white flex items-center justify-center font-medium">
          <i className="fa-brands fa-whatsapp mr-2"></i>
          <span>WhatsApp</span>
        </a>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (post?.id) {
            const success = deletePost(post.id);
            if (success) {
              toast.success('Article deleted');
              navigate('/admin');
            } else {
              toast.error('Failed to delete article');
            }
          }
        }}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default BlogPost;
