import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Message, ChatResponse, User } from '../types';
import clsx from 'clsx';

interface ChatProps {
  user: User;
  onLogout: () => void;
}

export const Chat: React.FC<ChatProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8003/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          department: user.department
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: formatResponse(data),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response: ChatResponse): string => {
    switch (response.source) {
      case 'erp':
        return `💼 **ERP System Data:**\n\n${response.response}`;
      case 'escalated':
        return `🔔 **${response.response}**`;
      case 'llm':
        return `${response.response}\n\n*Confidence: ${response.confidence?.toFixed(2) ?? 'N/A'}*`;
      default:
        return `⚠️ ${response.response}`;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bot className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">ERP AI Sentinel</h1>
              <p className="text-sm text-gray-600">
                {user.department} Department | {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              'flex items-start space-x-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="bg-indigo-100 p-2 rounded-full">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
            )}
            <div
              className={clsx(
                'max-w-2xl rounded-lg px-4 py-2 text-sm',
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200'
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={clsx(
                'text-xs mt-1',
                message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
              )}>
                {format(new Date(message.timestamp), 'HH:mm')}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="bg-gray-200 p-2 rounded-full">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start justify-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
              <div className="animate-pulse">Processing...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your ERP assistant..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={clsx(
              'px-4 py-2 rounded-lg flex items-center space-x-2',
              isLoading || !input.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            )}
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};