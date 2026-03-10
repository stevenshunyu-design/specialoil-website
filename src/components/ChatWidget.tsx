import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'admin' | 'system';
  content: string;
  sender_name?: string;
  created_at?: string;
}

interface ChatSession {
  id: string;
  visitor_id: string;
  status: 'waiting' | 'active' | 'closed';
}

const QUICK_QUESTIONS = [
  "What products do you offer?",
  "Tell me about Transformer Oil",
  "How to contact you?",
  "I need technical support"
];

// Generate or retrieve visitor ID
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'human'>('ai');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isWaitingForAgent, setIsWaitingForAgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const visitorId = useRef(getVisitorId());

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize socket connection when in human mode
  useEffect(() => {
    if (chatMode === 'human' && isOpen && !socketRef.current) {
      const socket = io({
        path: '/socket.io/',
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('Connected to chat server');
        socket.emit('visitor:join', { 
          visitorId: visitorId.current 
        });
      });

      socket.on('session:created', (newSession: ChatSession) => {
        setSession(newSession);
        if (newSession.status === 'waiting') {
          setIsWaitingForAgent(true);
          setMessages(prev => [...prev, {
            role: 'system',
            content: 'Connecting you to a human agent... Please wait.'
          }]);
        }
      });

      socket.on('session:active', () => {
        setIsWaitingForAgent(false);
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'A support agent has joined the chat.'
        }]);
      });

      socket.on('messages:history', (history: Message[]) => {
        const formattedHistory = history.map((msg: any) => ({
          id: msg.id,
          role: (msg.sender_type === 'visitor' ? 'user' : 'admin') as 'user' | 'admin',
          content: msg.message,
          sender_name: msg.sender_name,
          created_at: msg.created_at
        }));
        setMessages(prev => [...prev, ...formattedHistory]);
      });

      socket.on('message:new', (msg: any) => {
        const formattedMsg: Message = {
          id: msg.id,
          role: (msg.sender_type === 'visitor' ? 'user' : 'admin') as 'user' | 'admin',
          content: msg.message,
          sender_name: msg.sender_name,
          created_at: msg.created_at
        };
        setMessages(prev => [...prev, formattedMsg]);
      });

      socket.on('session:closed', () => {
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'Chat session has ended. Thank you for contacting us!'
        }]);
        setChatMode('ai');
        setSession(null);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
      });

      socketRef.current = socket;
    }

    return () => {
      if (socketRef.current && chatMode !== 'human') {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [chatMode, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    if (chatMode === 'human' && socketRef.current && session) {
      // Send via WebSocket
      socketRef.current.emit('visitor:message', {
        sessionId: session.id,
        message: userMessage
      });
      setIsLoading(false);
    } else {
      // AI mode
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            history: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
          })
        });

        const data = await response.json();

        if (data.needsHuman) {
          // Switch to human chat mode
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
          setChatMode('human');
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Welcome message when chat opens first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your assistant. How can I help you today?'
      }]);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#1a4d80] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-headset text-lg"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Customer Support</h3>
                  <p className="text-xs text-white/80">
                    {chatMode === 'ai' ? 'AI Assistant' : isWaitingForAgent ? 'Waiting for agent...' : 'Live Chat'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ minHeight: '300px', maxHeight: '400px' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#003366] rounded-br-md'
                      : msg.role === 'system'
                      ? 'bg-yellow-100 text-yellow-800 text-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}
                >
                  {msg.sender_name && msg.role === 'admin' && (
                    <p className="text-xs text-[#D4AF37] font-medium mb-1">{msg.sender_name}</p>
                  )}
                  <p className={`text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : ''}`}>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (only in AI mode with few messages) */}
          {chatMode === 'ai' && messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">Quick Questions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chatMode === 'human' ? "Type your message..." : "Ask me anything..."}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                disabled={isLoading || (chatMode === 'human' && isWaitingForAgent)}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading || (chatMode === 'human' && isWaitingForAgent)}
                className="w-10 h-10 bg-[#003366] text-white rounded-full flex items-center justify-center hover:bg-[#1a4d80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
          isOpen 
            ? 'bg-gray-600 text-white' 
            : 'bg-gradient-to-r from-[#003366] to-[#1a4d80] text-white'
        }`}
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-xl"></i>
        ) : (
          <i className="fa-solid fa-comments text-xl"></i>
        )}
      </button>

      {/* Unread Badge */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs">1</span>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
