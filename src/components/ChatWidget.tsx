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
            content: '🔄 Connecting you to a human agent... Please wait.'
          }]);
        }
      });

      socket.on('session:active', () => {
        setIsWaitingForAgent(false);
        setMessages(prev => [...prev, {
          role: 'system',
          content: '✅ A support agent has joined the chat.'
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

  // Focus input when chat opens or after sending message
  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (isOpen) {
      focusInput();
    }
  }, [isOpen, focusInput]);

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
      // Keep focus on input after sending
      focusInput();
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
      // Keep focus on input after sending
      focusInput();
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
    focusInput();
  };

  // Switch to human support
  const switchToHumanSupport = () => {
    setChatMode('human');
    setMessages(prev => [...prev, {
      role: 'system',
      content: '🔄 Switching to human support... Please wait while we connect you to an agent.'
    }]);
  };

  // Welcome message when chat opens first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '👋 Hello! I\'m your AI assistant. How can I help you today?\n\nYou can ask me about our products, services, or click "Human Support" to talk with a real person.'
      }]);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end max-w-[calc(100vw-2rem)]">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slideUp" style={{ maxHeight: '90vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#003366] text-white p-3 sm:p-4 relative overflow-hidden flex-shrink-0">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] rounded-full flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-headset text-base sm:text-lg text-white"></i>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#003366]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Customer Support</h3>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${chatMode === 'ai' ? 'bg-blue-300' : isWaitingForAgent ? 'bg-yellow-300 animate-pulse' : 'bg-green-400'}`}></span>
                    <p className="text-[10px] sm:text-xs text-white/80">
                      {chatMode === 'ai' ? 'AI Assistant Online' : isWaitingForAgent ? 'Waiting for agent...' : 'Live Chat Active'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center flex-shrink-0"
                aria-label="Minimize chat"
              >
                <i className="fa-solid fa-minus text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white" style={{ minHeight: '250px', maxHeight: '50vh' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {/* Avatar for assistant/admin */}
                {msg.role !== 'user' && msg.role !== 'system' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960C] flex items-center justify-center mr-1.5 sm:mr-2 flex-shrink-0 shadow">
                    <i className="fa-solid fa-robot text-white text-[10px] sm:text-xs"></i>
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl sm:rounded-2xl rounded-br-sm'
                      : msg.role === 'system'
                      ? 'bg-amber-50 text-amber-700 text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-amber-200'
                      : 'bg-white text-gray-800 rounded-xl sm:rounded-2xl rounded-bl-sm border border-gray-100'
                  }`}
                >
                  {msg.sender_name && msg.role === 'admin' && (
                    <p className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold mb-1">{msg.sender_name}</p>
                  )}
                  <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : ''}`}>{msg.content}</p>
                </div>
                
                {/* Avatar for user */}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center ml-1.5 sm:ml-2 flex-shrink-0 shadow">
                    <i className="fa-solid fa-user text-gray-600 text-[10px] sm:text-xs"></i>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960C] flex items-center justify-center mr-1.5 sm:mr-2 flex-shrink-0 shadow">
                  <i className="fa-solid fa-robot text-white text-[10px] sm:text-xs"></i>
                </div>
                <div className="bg-white text-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (only in AI mode with few messages) */}
          {chatMode === 'ai' && messages.length <= 2 && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 flex items-center gap-1">
                <i className="fa-solid fa-lightbulb text-[#D4AF37] text-[10px] sm:text-xs"></i>
                Quick Questions:
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-[#003366] hover:text-white rounded-full text-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Human Support Button (only in AI mode) */}
          {chatMode === 'ai' && (
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-gray-100 bg-white flex-shrink-0">
              <button
                onClick={switchToHumanSupport}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <i className="fa-solid fa-headset text-xs sm:text-sm"></i>
                Talk to Human Support
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex gap-1.5 sm:gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={chatMode === 'human' ? "Type your message..." : "Ask me anything..."}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all bg-gray-50 focus:bg-white"
                  disabled={isLoading || (chatMode === 'human' && isWaitingForAgent)}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading || (chatMode === 'human' && isWaitingForAgent)}
                className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
                aria-label="Send message"
              >
                <i className="fa-solid fa-paper-plane text-xs sm:text-sm"></i>
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 text-center">
              Press Enter to send
            </p>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 text-white rotate-0' 
            : 'bg-gradient-to-r from-[#003366] to-[#004080] text-white hover:shadow-xl hover:scale-110'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-lg sm:text-xl"></i>
        ) : (
          <i className="fa-solid fa-comments text-lg sm:text-xl"></i>
        )}
      </button>

      {/* Unread Badge */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-white text-[10px] sm:text-xs font-bold">1</span>
        </div>
      )}
      
      {/* Pulse animation ring */}
      {!isOpen && (
        <div className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#003366]/30 animate-ping pointer-events-none"></div>
      )}
    </div>
  );
};

export default ChatWidget;
