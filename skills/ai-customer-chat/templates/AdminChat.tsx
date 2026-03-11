import { useState, useEffect, useRef, useCallback } from 'react';

interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  customer_no: string | null;
  status: 'waiting' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  session_id: string;
  sender_type: 'visitor' | 'admin';
  sender_name: string;
  message: string;
  created_at: string;
}

// 按客户编号分组的会话
interface GroupedSessions {
  customerNo: string;
  sessions: ChatSession[];
  latestName: string;
  latestUpdate: string;
}

const AdminChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('Support');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionsPollRef = useRef<NodeJS.Timeout | null>(null);

  // 只在消息容器内滚动，不影响整个页面
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check admin auth
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'authenticated') {
      setIsAdmin(true);
      const savedName = localStorage.getItem('adminName');
      if (savedName) setAdminName(savedName);
    }
  }, []);

  // Fetch sessions periodically - including closed sessions for history
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.data.sort((a: ChatSession, b: ChatSession) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ));
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  }, []);

  // Fetch messages for selected session
  const fetchMessages = useCallback(async () => {
    if (!selectedSession) return;
    
    try {
      const response = await fetch(`/api/chat/sessions/${selectedSession.id}/messages`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [selectedSession]);

  // Start polling when admin is logged in
  useEffect(() => {
    if (!isAdmin) return;
    fetchSessions();
    sessionsPollRef.current = setInterval(fetchSessions, 5000);
    return () => {
      if (sessionsPollRef.current) clearInterval(sessionsPollRef.current);
    };
  }, [isAdmin, fetchSessions]);

  // Poll messages when session is selected
  useEffect(() => {
    if (!selectedSession || !isAdmin) return;
    fetchMessages();
    pollIntervalRef.current = setInterval(fetchMessages, 2000);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [selectedSession, isAdmin, fetchMessages]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (password === 'admin123') {
      localStorage.setItem('adminAuth', 'authenticated');
      localStorage.setItem('adminName', name || 'Support');
      setIsAdmin(true);
      setAdminName(name || 'Support');
    } else {
      alert('Invalid password');
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedSession) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/admin/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          message: inputValue.trim(),
          adminName: adminName
        })
      });
      if (response.ok) {
        setInputValue('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeSession = async () => {
    if (!selectedSession) return;
    if (confirm('Are you sure you want to close this chat?')) {
      try {
        await fetch(`/api/chat/sessions/${selectedSession.id}/close`, { method: 'POST' });
        setSelectedSession(prev => prev ? { ...prev, status: 'closed' } : null);
        fetchSessions();
      } catch (err) {
        console.error('Failed to close session:', err);
      }
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发选中会话
    
    if (!confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
      return;
    }
    
    setDeletingSession(sessionId);
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        // 如果删除的是当前选中的会话，清除选中状态
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setMessages([]);
        }
        // 刷新会话列表
        fetchSessions();
      } else {
        alert('Failed to delete conversation');
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Failed to delete conversation');
    }
    setDeletingSession(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminName');
    setIsAdmin(false);
    setSessions([]);
    setSelectedSession(null);
    setMessages([]);
  };

  const toggleGroup = (customerNo: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerNo)) {
        newSet.delete(customerNo);
      } else {
        newSet.add(customerNo);
      }
      return newSet;
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const waitingCount = sessions.filter(s => s.status === 'waiting').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;
  const closedCount = sessions.filter(s => s.status === 'closed').length;
  
  // 分离活跃会话和历史会话
  const activeSessions = sessions.filter(s => s.status !== 'closed');
  const closedSessionsList = sessions.filter(s => s.status === 'closed');

  // 按客户编号分组历史会话
  const groupedHistory = useCallback((): GroupedSessions[] => {
    const groups = new Map<string, GroupedSessions>();
    
    closedSessionsList.forEach(session => {
      const customerNo = session.customer_no || `#${session.id.substring(0, 4)}`;
      
      if (!groups.has(customerNo)) {
        groups.set(customerNo, {
          customerNo,
          sessions: [],
          latestName: session.visitor_name || 'Unknown',
          latestUpdate: session.updated_at
        });
      }
      
      const group = groups.get(customerNo)!;
      group.sessions.push(session);
      
      // 更新最新名称和更新时间
      if (new Date(session.updated_at) > new Date(group.latestUpdate)) {
        group.latestUpdate = session.updated_at;
        group.latestName = session.visitor_name || group.latestName;
      }
    });
    
    // 按最新更新时间排序
    return Array.from(groups.values()).sort(
      (a, b) => new Date(b.latestUpdate).getTime() - new Date(a.latestUpdate).getTime()
    );
  }, [closedSessionsList]);

  // Login form
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#003366] to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#003366]/40 rounded-full blur-3xl"></div>
        </div>
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/30">
              <i className="fa-solid fa-headset text-white text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-white">Support Dashboard</h1>
            <p className="text-white/60 text-sm mt-1">Customer Support Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all transform hover:scale-[1.02]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const historyGroups = groupedHistory();

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      {/* Sessions Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col transition-all duration-300 h-full`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-headset text-white"></i>
                </div>
                <div>
                  <h2 className="font-semibold text-white">Support Panel</h2>
                  <p className="text-xs text-white/50">{adminName}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <i className={`fa-solid fa-chevron-${sidebarCollapsed ? 'right' : 'left'}`}></i>
            </button>
          </div>
        </div>

        {/* Stats */}
        {!sidebarCollapsed && (
          <div className="p-3 grid grid-cols-3 gap-2 flex-shrink-0">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-2 text-center">
              <p className="text-lg font-bold text-amber-400">{waitingCount}</p>
              <p className="text-[10px] text-amber-400/70">Waiting</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-2 text-center">
              <p className="text-lg font-bold text-emerald-400">{activeCount}</p>
              <p className="text-[10px] text-emerald-400/70">Active</p>
            </div>
            <div className="bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30 rounded-xl p-2 text-center">
              <p className="text-lg font-bold text-slate-400">{historyGroups.length}</p>
              <p className="text-[10px] text-slate-400/70">Customers</p>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {sessions.length === 0 ? (
            <div className="p-4 text-center">
              <i className="fa-solid fa-inbox text-3xl text-white/20 mb-2"></i>
              {!sidebarCollapsed && <p className="text-white/40 text-sm">No chats yet</p>}
            </div>
          ) : (
            <>
              {/* Active Sessions */}
              {activeSessions.length > 0 && (
                <>
                  {!sidebarCollapsed && (
                    <div className="px-3 py-2 text-xs text-white/40 font-medium uppercase tracking-wider flex-shrink-0">
                      Active Chats ({activeSessions.length})
                    </div>
                  )}
                  {activeSessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`p-3 border-b border-white/5 cursor-pointer transition-all ${
                        selectedSession?.id === session.id 
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-l-2 border-l-[#D4AF37]' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            session.status === 'waiting' 
                              ? 'bg-amber-500/20 text-amber-400' 
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            <i className="fa-solid fa-user text-sm"></i>
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                            session.status === 'waiting' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}></span>
                        </div>
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white text-sm truncate">
                                {session.visitor_name ? `${session.visitor_name} (${session.customer_no || `#${session.id.substring(0, 4)}`})` : session.customer_no || `#${session.id.substring(0, 4)}`}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                session.status === 'waiting' 
                                  ? 'bg-amber-500/20 text-amber-400' 
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 truncate mt-0.5">
                              {session.visitor_email || 'No email'} · {formatDate(session.updated_at)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {/* Closed Sessions (History) - 按客户编号分组 */}
              {historyGroups.length > 0 && (
                <>
                  {/* History Header - 可点击折叠 */}
                  <div 
                    onClick={() => setHistoryCollapsed(!historyCollapsed)}
                    className="px-3 py-2 text-xs text-white/40 font-medium uppercase tracking-wider border-t border-white/10 mt-1 cursor-pointer hover:bg-white/5 flex items-center justify-between flex-shrink-0"
                  >
                    <span className="flex items-center gap-2">
                      <i className={`fa-solid fa-chevron-${historyCollapsed ? 'right' : 'down'} text-[10px]`}></i>
                      📁 History ({historyGroups.length} customers, {closedCount} chats)
                    </span>
                    {!sidebarCollapsed && (
                      <span className="text-[10px] text-white/30">
                        {historyCollapsed ? 'Click to expand' : 'Click to collapse'}
                      </span>
                    )}
                  </div>
                  
                  {/* History Groups - 根据折叠状态显示/隐藏 */}
                  {!historyCollapsed && historyGroups.map(group => (
                    <div key={group.customerNo}>
                      {/* Group Header */}
                      <div 
                        onClick={() => toggleGroup(group.customerNo)}
                        className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all flex items-center gap-3 ${
                          expandedGroups.has(group.customerNo) ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-500/20 text-slate-400">
                            <i className="fa-solid fa-user text-sm"></i>
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-slate-600 text-white text-[10px] flex items-center justify-center font-bold">
                            {group.sessions.length}
                          </span>
                        </div>
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white/70 text-sm truncate">
                                {group.latestName} ({group.customerNo})
                              </span>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <i className={`fa-solid fa-chevron-${expandedGroups.has(group.customerNo) ? 'down' : 'right'} text-[10px] text-white/30`}></i>
                              </div>
                            </div>
                            <p className="text-xs text-white/30 truncate mt-0.5">
                              {group.sessions.length} conversation{group.sessions.length > 1 ? 's' : ''} · Last {formatDate(group.latestUpdate)}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Group Sessions - 展开时显示 */}
                      {expandedGroups.has(group.customerNo) && group.sessions.map(session => (
                        <div
                          key={session.id}
                          onClick={() => handleSelectSession(session)}
                          className={`p-3 pl-12 border-b border-white/5 cursor-pointer transition-all group ${
                            selectedSession?.id === session.id 
                              ? 'bg-gradient-to-r from-slate-600/30 to-transparent border-l-2 border-l-slate-400' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white/60 text-sm">
                                  {session.visitor_name || 'Unknown'}
                                </span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">
                                    {formatDate(session.updated_at)}
                                  </span>
                                  {/* 删除按钮 */}
                                  <button
                                    onClick={(e) => deleteSession(session.id, e)}
                                    disabled={deletingSession === session.id}
                                    className="p-1 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete conversation"
                                  >
                                    <i className={`fa-solid ${deletingSession === session.id ? 'fa-spinner fa-spin' : 'fa-trash'} text-xs`}></i>
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-white/25 truncate mt-0.5">
                                {session.visitor_email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-user text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {selectedSession.visitor_name || selectedSession.customer_no || `#${selectedSession.id.substring(0, 8)}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-envelope"></i>
                      {selectedSession.visitor_email || 'No email'}
                    </span>
                    {selectedSession.visitor_phone && (
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-phone"></i>
                        {selectedSession.visitor_phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedSession.status === 'closed'
                    ? 'bg-slate-100 text-slate-600'
                    : selectedSession.status === 'waiting' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedSession.status === 'closed' ? '🔒 Closed' : selectedSession.status === 'waiting' ? '⏳ Waiting' : '🟢 Active'}
                </span>
                {selectedSession.status !== 'closed' && (
                  <button
                    onClick={closeSession}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-times"></i>
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Messages - 使用 ref 控制滚动 */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-100 to-slate-50"
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-400">
                    <i className="fa-solid fa-comments text-4xl mb-2"></i>
                    <p>No messages yet</p>
                  </div>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[75%] ${
                      msg.sender_type === 'visitor' ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender_type === 'visitor' 
                          ? 'bg-slate-200 text-slate-600' 
                          : 'bg-gradient-to-br from-[#003366] to-[#004080] text-white'
                      }`}>
                        <i className={`fa-solid ${msg.sender_type === 'visitor' ? 'fa-user' : 'fa-headset'} text-xs`}></i>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.sender_type === 'visitor'
                          ? 'bg-white border border-slate-200 rounded-bl-md shadow-sm'
                          : 'bg-[#003366] rounded-br-md shadow-lg'
                      }`}>
                        {msg.sender_type === 'admin' && (
                          <p className="text-xs text-[#D4AF37] mb-1 font-semibold">{msg.sender_name}</p>
                        )}
                        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                          msg.sender_type === 'visitor' ? 'text-slate-800' : 'text-white'
                        }`}>{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_type === 'visitor' ? 'text-slate-400' : 'text-white/60'
                        }`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
              {selectedSession.status === 'closed' ? (
                <div className="text-center py-3">
                  <p className="text-slate-500 text-sm">🔒 This conversation has been closed</p>
                  <p className="text-slate-400 text-xs mt-1">Messages are preserved for reference</p>
                </div>
              ) : (
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] resize-none transition-all"
                      disabled={isLoading}
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#003366]/30 transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-comments text-4xl text-slate-400"></i>
              </div>
              <p className="text-lg text-slate-600 font-medium">Select a conversation</p>
              <p className="text-sm text-slate-400 mt-2">Choose a chat from the sidebar to start</p>
              {waitingCount > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  {waitingCount} customer(s) waiting
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
