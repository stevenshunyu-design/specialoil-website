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

const AdminChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('Support');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionsPollRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        // Show all sessions including closed ones, sorted by updated_at desc
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
        setSelectedSession(null);
        setMessages([]);
        fetchSessions();
      } catch (err) {
        console.error('Failed to close session:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminName');
    setIsAdmin(false);
    setSessions([]);
    setSelectedSession(null);
    setMessages([]);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const waitingCount = sessions.filter(s => s.status === 'waiting').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;

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

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sessions Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
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
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{waitingCount}</p>
              <p className="text-xs text-amber-400/70">Waiting</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
              <p className="text-xs text-emerald-400/70">Active</p>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center">
              <i className="fa-solid fa-inbox text-3xl text-white/20 mb-2"></i>
              {!sidebarCollapsed && <p className="text-white/40 text-sm">No active chats</p>}
            </div>
          ) : (
            sessions.map(session => (
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
                      session.status === 'closed'
                        ? 'bg-slate-500/20 text-slate-400'
                        : session.status === 'waiting' 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <i className="fa-solid fa-user text-sm"></i>
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                      session.status === 'closed' 
                        ? 'bg-slate-500' 
                        : session.status === 'waiting' 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                    }`}></span>
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white text-sm">
                          {session.visitor_name || session.customer_no || `#${session.id.substring(0, 4)}`}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          session.status === 'closed'
                            ? 'bg-slate-500/20 text-slate-400'
                            : session.status === 'waiting' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {session.visitor_email || 'No email'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
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
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-100 to-slate-50">
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
                          ? 'bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-100'
                          : 'bg-[#003366] text-white rounded-br-md shadow-lg'
                      }`}>
                        {msg.sender_type === 'admin' && (
                          <p className="text-xs text-[#D4AF37] mb-1 font-semibold">{msg.sender_name}</p>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_type === 'visitor' ? 'text-slate-400' : 'text-white/50'
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
            <div className="p-4 bg-white border-t border-slate-200">
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
