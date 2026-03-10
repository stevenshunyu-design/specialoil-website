import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

const ChatWidget = ({ position = 'bottom-right' }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 欢迎消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '您好！我是CN-SpecLube的AI助手 🤖\n\n我可以帮您了解我们的产品：\n• 变压器油\n• 橡胶操作油\n• 成品润滑油\n• 基础油\n\n请问有什么可以帮您的？',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 添加用户消息
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          userEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }]);
        
        // 如果是人工转接，显示邮箱输入
        if (data.isHumanHandoff) {
          setShowEmailInput(true);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '抱歉，我暂时无法回答。请联系我们：steven.shunyu@gmail.com',
          timestamp: new Date()
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '网络错误，请稍后重试或联系客服：steven.shunyu@gmail.com',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const submitEmail = () => {
    if (userEmail.trim()) {
      setShowEmailInput(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `感谢您提供邮箱：${userEmail}\n\n我们的客服团队会尽快联系您！`,
        timestamp: new Date()
      }]);
    }
  };

  // 快捷问题
  const quickQuestions = [
    '你们有哪些产品？',
    '变压器油价格',
    '如何联系你们？',
    '转人工客服'
  ];

  return (
    <div className={`fixed z-50 ${position === 'bottom-right' ? 'right-6 bottom-6' : 'left-6 bottom-6'}`}>
      {/* 聊天窗口 */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* 头部 */}
          <div className="bg-gradient-to-r from-[#003366] to-[#1a4d80] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-robot text-white"></i>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI 助手</h3>
                <p className="text-xs text-white/70">CN-SpecLube</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ minHeight: '300px', maxHeight: '400px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-[#003366] text-white rounded-br-sm' 
                    : 'bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-700 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">快捷问题：</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(q);
                      inputRef.current?.focus();
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 邮箱输入 */}
          {showEmailInput && (
            <div className="px-4 py-3 border-t border-gray-100 bg-yellow-50">
              <p className="text-xs text-gray-600 mb-2">请留下您的邮箱，客服会联系您：</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <button
                  onClick={submitEmail}
                  className="px-4 py-2 bg-[#D4AF37] text-white text-sm rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  提交
                </button>
              </div>
            </div>
          )}

          {/* 输入区域 */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题..."
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 bg-[#003366] text-white rounded-full flex items-center justify-center hover:bg-[#1a4d80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-paper-plane text-sm"></i>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              按 Enter 发送 · 输入"人工"转客服
            </p>
          </div>
        </div>
      )}

      {/* 聊天按钮 */}
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

      {/* 未读提示（仅当关闭时显示） */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
          <span className="text-white text-xs">1</span>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
