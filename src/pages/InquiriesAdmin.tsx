import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Inquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  product_category: string | null;
  port_of_destination: string;
  estimated_quantity: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

const InquiriesAdmin = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      const result = await response.json();
      if (result.data) {
        setInquiries(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast.success('Status updated');
        fetchInquiries();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const updateNotes = async (id: number) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      
      if (response.ok) {
        toast.success('Notes saved');
        fetchInquiries();
        setSelectedInquiry(null);
      } else {
        toast.error('Failed to save notes');
      }
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Inquiry deleted');
        fetchInquiries();
      } else {
        toast.error('Failed to delete inquiry');
      }
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInquiries = inquiries.filter(
    inquiry => filterStatus === 'all' || inquiry.status === filterStatus
  );

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    quoted: inquiries.filter(i => i.status === 'quoted').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-[#003366]"></i>
      </div>
    );
  }

  return (
    <div>
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-sm shadow-sm text-center">
          <div className="text-2xl font-bold text-[#003366]">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm text-center cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('new')}>
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          <div className="text-sm text-gray-500">New</div>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm text-center cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('contacted')}>
          <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
          <div className="text-sm text-gray-500">Contacted</div>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm text-center cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('quoted')}>
          <div className="text-2xl font-bold text-purple-600">{stats.quoted}</div>
          <div className="text-sm text-gray-500">Quoted</div>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm text-center cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('closed')}>
          <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
          <div className="text-sm text-gray-500">Closed</div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm text-gray-600">Filter:</span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-sm text-sm"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* 询盘列表 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#003366] text-white">
              <th className="p-4 text-left font-semibold text-sm">Date</th>
              <th className="p-4 text-left font-semibold text-sm">Contact</th>
              <th className="p-4 text-left font-semibold text-sm">Company</th>
              <th className="p-4 text-left font-semibold text-sm">Product</th>
              <th className="p-4 text-left font-semibold text-sm">Port</th>
              <th className="p-4 text-left font-semibold text-sm">Status</th>
              <th className="p-4 text-left font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="bg-white hover:bg-[#F4F6F9] transition-colors">
                  <td className="p-4 border-b border-gray-200 text-sm">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className="font-medium text-[#003366]">{inquiry.name}</div>
                    <div className="text-sm text-gray-500">{inquiry.email}</div>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-sm">{inquiry.company}</td>
                  <td className="p-4 border-b border-gray-200 text-sm">{inquiry.product_category || '-'}</td>
                  <td className="p-4 border-b border-gray-200 text-sm">{inquiry.port_of_destination}</td>
                  <td className="p-4 border-b border-gray-200">
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-sm border-0 ${getStatusColor(inquiry.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setNotes(inquiry.notes || '');
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-sm hover:bg-opacity-90"
                      >
                        <i className="fa-solid fa-eye mr-1"></i>View
                      </button>
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded-sm hover:bg-opacity-90"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                  <p>No inquiries found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 详情弹窗 */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-[#003366]">Inquiry Details</h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Contact Person</label>
                  <div className="font-medium">{selectedInquiry.name}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Company</label>
                  <div className="font-medium">{selectedInquiry.company}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Product Category</label>
                  <div>{selectedInquiry.product_category || '-'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Port of Destination</label>
                  <div className="font-medium">{selectedInquiry.port_of_destination}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Estimated Quantity</label>
                  <div>{selectedInquiry.estimated_quantity || '-'}</div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Message</label>
                <div className="bg-gray-50 p-3 rounded-sm text-sm">
                  {selectedInquiry.message || 'No message'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Notes (Internal)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  placeholder="Add internal notes..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 border border-gray-300 rounded-sm text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateNotes(selectedInquiry.id)}
                className="px-4 py-2 bg-[#003366] text-white rounded-sm text-sm hover:bg-opacity-90"
              >
                Save Notes
              </button>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: Your Inquiry about ${selectedInquiry.product_category || 'Special Oil Products'}`}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-sm text-sm hover:bg-opacity-90"
              >
                <i className="fa-solid fa-envelope mr-1"></i>Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesAdmin;
