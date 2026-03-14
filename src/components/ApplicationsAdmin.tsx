import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '../components/ui/ConfirmDialog';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  expertise_areas: string[];
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string;
  created_at: string;
  reviewed_at: string;
  username: string;
}

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all' 
        ? '/api/admin/applications' 
        : `/api/admin/applications?status=${filterStatus}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/applications/${selectedApp.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Application approved! Account created and email sent.');
        setShowApproveDialog(false);
        setSelectedApp(null);
        fetchApplications();
      } else {
        toast.error(data.error || 'Failed to approve');
      }
    } catch (error) {
      toast.error('Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/applications/${selectedApp.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject', 
          rejectionReason: rejectionReason 
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Application rejected and email sent.');
        setShowRejectDialog(false);
        setSelectedApp(null);
        setRejectionReason('');
        fetchApplications();
      } else {
        toast.error(data.error || 'Failed to reject');
      }
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setProcessing(false);
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

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-400">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-400">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 申请列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Expertise</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.email}</p>
                        {app.phone && <p className="text-xs text-gray-400">{app.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{app.company || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.expertise_areas?.slice(0, 3).map((area) => (
                          <span key={area} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                            {area}
                          </span>
                        ))}
                        {app.expertise_areas?.length > 3 && (
                          <span className="text-xs text-gray-400">+{app.expertise_areas.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-[#003366] hover:text-[#004080] font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <i className="fa-solid fa-user-plus text-4xl mb-4 opacity-50"></i>
                      <p>No applications found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <i className="fa-solid fa-times text-gray-400"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium text-gray-900">{selectedApp.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium text-gray-900">{selectedApp.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Company</label>
                  <p className="font-medium text-gray-900">{selectedApp.company || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Applied Date</label>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedApp.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm text-gray-500">Areas of Expertise</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApp.expertise_areas?.map((area) => (
                    <span key={area} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                  {(!selectedApp.expertise_areas || selectedApp.expertise_areas.length === 0) && (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm text-gray-500">About</label>
                <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700">
                  {selectedApp.bio || 'No description provided'}
                </p>
              </div>

              {selectedApp.status === 'approved' && selectedApp.username && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Username:</strong> {selectedApp.username}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Account created and email sent</p>
                </div>
              )}

              {selectedApp.status === 'rejected' && selectedApp.rejection_reason && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {selectedApp.rejection_reason}
                  </p>
                </div>
              )}
            </div>
            
            {selectedApp.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={() => setShowRejectDialog(true)}
                  className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50"
                >
                  <i className="fa-solid fa-times mr-2"></i>Reject
                </button>
                <button
                  onClick={() => setShowApproveDialog(true)}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  <i className="fa-solid fa-check mr-2"></i>Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 批准确认 */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Approve Application"
        message={`Approve ${selectedApp?.name}'s application? A login account will be created and credentials will be sent to ${selectedApp?.email}.`}
        confirmText="Approve"
        cancelText="Cancel"
        variant="info"
      />

      {/* 拒绝弹窗 */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection (optional):</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Insufficient experience in the field..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsAdmin;
