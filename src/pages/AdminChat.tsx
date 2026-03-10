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

  // Fetch sessions periodically
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.data.filter((s: ChatSession) => s.status !== 'closed'));
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

    // Initial fetch
    fetchSessions();

    // Poll sessions every 5 seconds
    sessionsPollRef.current = setInterval(fetchSessions, 5000);

    return () => {
      if (sessionsPollRef.current) {
        clearInterval(sessionsPollRef.current);
      }
    };
  }, [isAdmin, fetchSessions]);

  // Poll messages when session is selected
  useEffect(() => {
    if (!selectedSession || !isAdmin) return;

    // Initial fetch
    fetchMessages();

    // Poll messages every 2 seconds
    pollIntervalRef.current = setInterval(fetchMessages, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
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
        // Immediately fetch new messages
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
        await fetch(`/api/chat/sessions/${selectedSession.id}/close`, {
          method: 'POST'
        });
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
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Login form
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004080] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-headset text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Customer Support Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sessions Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#003366] to-[#004080]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-headset text-white"></i>
              </div>
              <div>
                <h2 className="font-semibold text-white">Support Panel</h2>
                <p className="text-xs text-white/70">{adminName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white text-sm"
            >
              <i className="fa-solid fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-center">
              <p className="text-lg font-bold text-orange-600">{sessions.filter(s => s.status === 'waiting').length}</p>
              <p className="text-xs text-orange-500">Waiting</p>
            </div>
            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
              <p className="text-lg font-bold text-green-600">{sessions.filter(s => s.status === 'active').length}</p>
              <p className="text-xs text-green-500">Active</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <i className="fa-solid fa-comments text-4xl text-gray-300 mb-2"></i>
              <p>No active conversations</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-l-[#003366]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">
                    {session.customer_no || `#${session.id.substring(0, 4)}`}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    session.status === 'waiting' 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {session.visitor_name || session.visitor_email || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(session.updated_at)} {formatTime(session.updated_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-user text-gray-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedSession.customer_no || `#${selectedSession.id.substring(0, 8)}`}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedSession.visitor_name || 'Anonymous'}
                    {selectedSession.visitor_email && ` • ${selectedSession.visitor_email}`}
                    {selectedSession.visitor_phone && ` • ${selectedSession.visitor_phone}`}
                  </p>
                </div>
              </div>
              <button
                onClick={closeSession}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
              >
                <i className="fa-solid fa-times mr-1"></i>
                Close Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.sender_type === 'visitor'
                        ? 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                        : 'bg-[#003366] text-white rounded-br-sm'
                    }`}
                  >
                    {msg.sender_type === 'admin' && (
                      <p className="text-xs text-white/70 mb-1">{msg.sender_name}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender_type === 'visitor' ? 'text-gray-400' : 'text-white/50'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/50"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-2 bg-[#003366] text-white rounded-xl hover:bg-[#004080] transition-colors disabled:opacity-50"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <i className="fa-solid fa-comments text-6xl text-gray-300 mb-4"></i>
              <p className="text-lg">Select a conversation to start chatting</p>
              <p className="text-sm text-gray-400 mt-2">
                {sessions.filter(s => s.status === 'waiting').length > 0 && (
                  <span className="text-orange-500">
                    {sessions.filter(s => s.status === 'waiting').length} customer(s) waiting
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
