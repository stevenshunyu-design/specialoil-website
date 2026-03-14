import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '../components/ui/ConfirmDialog';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string;
  author: string;
  author_id: string;
  review_status: 'pending' | 'approved' | 'rejected' | 'draft';
  rejection_reason: string;
  created_at: string;
  reviewed_at: string;
  view_count: number;
  like_count: number;
  authors?: {
    name: string;
    display_name: string;
    email: string;
  };
}

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [totalArticles, setTotalArticles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchArticles();
  }, [filterStatus, currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      const response = await fetch(`/api/admin/articles?${params}`);
      const data = await response.json();
      if (data.success) {
        setArticles(data.data || []);
        setTotalArticles(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedArticle) return;
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/articles/${selectedArticle.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Article approved and published!');
        setShowApproveDialog(false);
        setSelectedArticle(null);
        fetchArticles();
      } else {
        toast.error(data.error || 'Failed to approve');
      }
    } catch (error) {
      toast.error('Failed to approve article');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedArticle) return;
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/articles/${selectedArticle.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject', 
          rejectionReason: rejectionReason 
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Article rejected and author notified.');
        setShowRejectDialog(false);
        setSelectedArticle(null);
        setRejectionReason('');
        fetchArticles();
      } else {
        toast.error(data.error || 'Failed to reject');
      }
    } catch (error) {
      toast.error('Failed to reject article');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
    };
    const style = styles[status] || styles.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: totalArticles,
    pending: articles.filter(a => a.review_status === 'pending').length,
    approved: articles.filter(a => a.review_status === 'approved').length,
    rejected: articles.filter(a => a.review_status === 'rejected').length,
  };

  const totalPages = Math.ceil(totalArticles / pageSize);

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Articles</p>
          <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-400">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-400">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="flex items-center gap-4">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Published</option>
          <option value="rejected">Rejected</option>
          <option value="draft">Draft</option>
        </select>
        
        {filterStatus === 'pending' && stats.pending > 0 && (
          <div className="flex items-center gap-2 text-yellow-600">
            <i className="fa-solid fa-exclamation-circle"></i>
            <span className="text-sm font-medium">{stats.pending} articles waiting for review</span>
          </div>
        )}
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <i className="fa-solid fa-file-lines text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No articles found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Article</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {article.featured_image && (
                          <img 
                            src={article.featured_image} 
                            alt="" 
                            className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1">{article.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                          {article.rejection_reason && (
                            <p className="text-xs text-red-500 mt-1">
                              <i className="fa-solid fa-info-circle mr-1"></i>
                              {article.rejection_reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{article.authors?.display_name || article.authors?.name || article.author}</p>
                        {article.authors?.email && (
                          <p className="text-xs text-gray-400">{article.authors.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(article.review_status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* 预览按钮 */}
                        <button
                          onClick={() => {
                            setSelectedArticle(article);
                            setShowPreviewDialog(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        
                        {/* 审核按钮 - 仅待审核状态显示 */}
                        {article.review_status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedArticle(article);
                                setShowApproveDialog(true);
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedArticle(article);
                                setShowRejectDialog(true);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <i className="fa-solid fa-times"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalArticles)} of {totalArticles} articles
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 预览对话框 */}
      {showPreviewDialog && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Article Preview</h3>
              <button
                onClick={() => setShowPreviewDialog(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {/* 文章预览内容 */}
              {selectedArticle.featured_image && (
                <img 
                  src={selectedArticle.featured_image} 
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span><i className="fa-solid fa-user mr-1"></i> {selectedArticle.authors?.display_name || selectedArticle.author}</span>
                <span><i className="fa-solid fa-folder mr-1"></i> {selectedArticle.category}</span>
                <span><i className="fa-solid fa-calendar mr-1"></i> {formatDate(selectedArticle.created_at)}</span>
              </div>
              <div className="flex gap-2 mb-6">
                {selectedArticle.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              {selectedArticle.review_status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowPreviewDialog(false);
                      setShowRejectDialog(true);
                    }}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewDialog(false);
                      setShowApproveDialog(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve & Publish
                  </button>
                </>
              )}
              {selectedArticle.review_status !== 'pending' && (
                <button
                  onClick={() => setShowPreviewDialog(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 批准确认对话框 */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Approve Article"
        message={`Are you sure you want to approve "${selectedArticle?.title}"? It will be published immediately and the author will be notified.`}
        confirmText="Approve & Publish"
        cancelText="Cancel"
        variant="success"
        loading={processing}
      />

      {/* 拒绝对话框 */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Article</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedArticle?.title}". This will be sent to the author.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Reject Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesAdmin;
