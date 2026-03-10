import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

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

  // Initialize socket connection
  useEffect(() => {
    if (!isAdmin) return;

    const socket = io({
      path: '/socket.io/',
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Admin connected to chat server');
      socket.emit('admin:join', 'admin-' + Date.now());
    });

    socket.on('sessions:waiting', (waitingSessions: ChatSession[]) => {
      setSessions(prev => {
        const activeIds = new Set(prev.filter(s => s.status === 'active').map(s => s.id));
        const newSessions = [...prev.filter(s => activeIds.has(s.id)), ...waitingSessions];
        return newSessions.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
    });

    socket.on('session:waiting', (session: ChatSession) => {
      setSessions(prev => {
        if (prev.find(s => s.id === session.id)) return prev;
        return [session, ...prev].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
    });

    socket.on('session:taken', ({ sessionId }: { sessionId: string }) => {
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, status: 'active' } : s
      ));
    });

    socket.on('message:new', (msg: Message) => {
      if (selectedSession?.id === msg.session_id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [isAdmin, selectedSession?.id]);

  // Fetch all sessions
  useEffect(() => {
    if (!isAdmin) return;
    
    fetch('/api/chat/sessions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessions(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch sessions:', err));
  }, [isAdmin]);

  // Fetch messages when session selected
  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }

    fetch(`/api/chat/sessions/${selectedSession.id}/messages`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch messages:', err));
  }, [selectedSession]);

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

  const handleTakeover = (session: ChatSession) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('admin:takeover', {
      sessionId: session.id,
      adminId: 'admin'
    });

    setSelectedSession({ ...session, status: 'active' });
    setSessions(prev => prev.map(s => 
      s.id === session.id ? { ...s, status: 'active' } : s
    ));
  };

  const handleSelectSession = (session: ChatSession) => {
    if (session.status === 'waiting') {
      handleTakeover(session);
    } else {
      setSelectedSession(session);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !selectedSession || !socketRef.current) return;

    socketRef.current.emit('admin:message', {
      sessionId: selectedSession.id,
      message: inputValue.trim(),
      adminName: adminName
    });

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeSession = () => {
    if (!selectedSession || !socketRef.current) return;
    
    if (confirm('Are you sure you want to close this chat?')) {
      socketRef.current.emit('session:close', selectedSession.id);
      setSelectedSession(null);
      setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Login screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-lock text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 mt-2">Enter your credentials to access the chat dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., John Support"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#003366] text-white rounded-lg hover:bg-[#1a4d80] transition-colors font-medium"
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
      {/* Sidebar - Session List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-[#003366]">
          <h1 className="text-xl font-bold text-white">Customer Chats</h1>
          <p className="text-white/70 text-sm mt-1">Welcome, {adminName}</p>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-600">Online as {adminName}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <i className="fa-solid fa-comments text-4xl mb-2 text-gray-300"></i>
              <p>No active chats</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-[#003366]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">
                      {session.visitor_name || 'Visitor'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      session.status === 'waiting' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : session.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {session.visitor_email || session.visitor_id.substring(0, 12) + '...'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(session.updated_at).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
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
                  <h2 className="font-medium text-gray-800">
                    {selectedSession.visitor_name || 'Visitor'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedSession.visitor_email || selectedSession.visitor_id.substring(0, 20)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeSession}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-phone-slash mr-2"></i>
                End Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.sender_type === 'visitor'
                        ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                        : 'bg-[#003366] text-white rounded-br-md'
                    }`}
                  >
                    {msg.sender_type === 'admin' && (
                      <p className="text-xs text-[#D4AF37] font-medium mb-1">{msg.sender_name}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender_type === 'visitor' ? 'text-gray-400' : 'text-white/60'
                    }`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-[#003366] text-white rounded-xl hover:bg-[#1a4d80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <i className="fa-solid fa-comments text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Chat</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
