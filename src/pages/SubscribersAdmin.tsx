import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Subscriber {
  id: number;
  email: string;
  status: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

interface NewsletterArticle {
  title: string;
  summary: string;
  url: string;
}

const SubscribersAdmin = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Newsletter 发送表单
  const [showSendForm, setShowSendForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterPreview, setNewsletterPreview] = useState('');
  const [newsletterArticles, setNewsletterArticles] = useState<NewsletterArticle[]>([
    { title: '', summary: '', url: '' }
  ]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/subscribers');
      const result = await response.json();
      
      if (result.success) {
        setSubscribers(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    try {
      const response = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
    }
  };

  const addArticle = () => {
    setNewsletterArticles(prev => [...prev, { title: '', summary: '', url: '' }]);
  };

  const removeArticle = (index: number) => {
    setNewsletterArticles(prev => prev.filter((_, i) => i !== index));
  };

  const updateArticle = (index: number, field: keyof NewsletterArticle, value: string) => {
    setNewsletterArticles(prev => prev.map((article, i) => 
      i === index ? { ...article, [field]: value } : article
    ));
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validArticles = newsletterArticles.filter(a => a.title && a.url);
    if (!newsletterSubject || validArticles.length === 0) {
      alert('Please fill in subject and at least one article');
      return;
    }
    
    setSending(true);
    
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newsletterSubject,
          previewText: newsletterPreview,
          articles: validArticles
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Newsletter sent successfully to ${result.sentCount} subscribers!`);
        setShowSendForm(false);
        setNewsletterSubject('');
        setNewsletterPreview('');
        setNewsletterArticles([{ title: '', summary: '', url: '' }]);
      } else {
        alert(`Failed to send: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  // 过滤订阅者
  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计
  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--primary-900)] font-['Montserrat']">
              Newsletter Subscribers
            </h1>
            <p className="text-[var(--muted-foreground)] mt-2">
              Manage your email subscribers and send newsletters
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              to="/admin"
              className="px-4 py-2 border border-[var(--border)] rounded-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Admin
            </Link>
            <button
              onClick={() => setShowSendForm(!showSendForm)}
              className="px-4 py-2 bg-[var(--accent-600)] text-white rounded-sm hover:bg-[var(--accent-700)] transition-colors"
            >
              <i className="fa-solid fa-paper-plane mr-2"></i>
              Send Newsletter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--muted)] rounded-sm p-6">
            <div className="text-3xl font-bold text-[var(--primary-900)]">{subscribers.length}</div>
            <div className="text-[var(--muted-foreground)]">Total Subscribers</div>
          </div>
          <div className="bg-green-50 rounded-sm p-6">
            <div className="text-3xl font-bold text-green-600">{activeCount}</div>
            <div className="text-green-700">Active</div>
          </div>
          <div className="bg-red-50 rounded-sm p-6">
            <div className="text-3xl font-bold text-red-600">{unsubscribedCount}</div>
            <div className="text-red-700">Unsubscribed</div>
          </div>
        </div>

        {/* Send Newsletter Form */}
        {showSendForm && (
          <div className="bg-[var(--muted)] rounded-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-[var(--primary-900)] mb-4">
              Compose Newsletter
            </h2>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)]"
                  placeholder="e.g., Monthly Industry Update"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Preview Text (optional)
                </label>
                <input
                  type="text"
                  value={newsletterPreview}
                  onChange={(e) => setNewsletterPreview(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)]"
                  placeholder="A brief summary shown in email clients"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Articles *
                  </label>
                  <button
                    type="button"
                    onClick={addArticle}
                    className="text-sm text-[var(--accent-600)] hover:text-[var(--accent-700)]"
                  >
                    <i className="fa-solid fa-plus mr-1"></i>
                    Add Article
                  </button>
                </div>
                
                {newsletterArticles.map((article, index) => (
                  <div key={index} className="bg-white rounded-sm p-4 mb-3 border border-[var(--border)]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Article {index + 1}</span>
                      {newsletterArticles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArticle(index)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={article.title}
                        onChange={(e) => updateArticle(index, 'title', e.target.value)}
                        className="px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)]"
                        placeholder="Article title"
                      />
                      <input
                        type="url"
                        value={article.url}
                        onChange={(e) => updateArticle(index, 'url', e.target.value)}
                        className="px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)]"
                        placeholder="Article URL"
                      />
                      <textarea
                        value={article.summary}
                        onChange={(e) => updateArticle(index, 'summary', e.target.value)}
                        className="px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)] md:col-span-2"
                        placeholder="Brief summary"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-3 bg-[var(--accent-600)] text-white rounded-sm hover:bg-[var(--accent-700)] transition-colors disabled:opacity-50"
                >
                  {sending ? (
                    <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Sending...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane mr-2"></i>Send to {activeCount} Subscribers</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="px-6 py-3 border border-[var(--border)] rounded-sm hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-600)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-[var(--accent-600)]"></i>
          </div>
        ) : (
          <div className="bg-white border border-[var(--border)] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium text-[var(--foreground)]">Email</th>
                    <th className="text-left px-6 py-4 font-medium text-[var(--foreground)]">Status</th>
                    <th className="text-left px-6 py-4 font-medium text-[var(--foreground)]">Subscribed</th>
                    <th className="text-left px-6 py-4 font-medium text-[var(--foreground)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-[var(--muted-foreground)]">
                        No subscribers found
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="border-t border-[var(--border)]">
                        <td className="px-6 py-4">{sub.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sub.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--muted-foreground)]">
                          {formatDate(sub.subscribed_at)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribersAdmin;
