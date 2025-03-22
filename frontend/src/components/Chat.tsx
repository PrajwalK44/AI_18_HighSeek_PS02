import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      setRecognitionSupported(false);
      return;
    }

    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    // Setup speech synthesis event handlers
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Stop recording if it's active
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

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

  // Get clean text for speech synthesis (remove markdown and emojis)
  const getCleanTextForSpeech = (text: string): string => {
    // Remove markdown formatting
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/\n\n/g, '. ')          // Replace double newlines with a period and space
      .replace(/\n/g, ' ')             // Replace single newlines with a space
      
    // Remove emojis and other symbols
    cleanText = cleanText
      .replace(/💼|🔔|⚠️/g, '')
      .trim();
      
    return cleanText;
  };

  const speakMessage = (message: Message) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    // Create a new utterance with clean text
    const cleanText = getCleanTextForSpeech(message.content);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure speech options
    const voices = speechSynthesis.getVoices();
    // Try to find a good voice (prefer female voice for assistant messages)
    if (voices.length > 0) {
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Google') || 
        voice.name.includes('Samantha')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Set up events
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setIsSpeaking(false);
    };
    
    // Save reference and start speaking
    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
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
            key={`message-${index}-${message.timestamp}`}
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
                'max-w-2xl rounded-lg px-4 py-2 text-sm relative group',
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200'
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={clsx(
                'text-xs mt-1 flex items-center justify-between',
                message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
              )}>
                <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                
                {message.role === 'assistant' && (
                  <button
                    onClick={() => message.role === 'assistant' && speakMessage(message)}
                    className={clsx(
                      'ml-2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity',
                      isSpeaking ? 'text-indigo-600 bg-indigo-100' : 'text-gray-500 hover:bg-gray-100'
                    )}
                    title={isSpeaking ? "Stop speaking" : "Listen to this message"}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>
                )}
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
          {recognitionSupported && (
            <button
              onClick={toggleRecording}
              className={clsx(
                'p-2 rounded-full',
                isRecording
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening..." : "Ask your ERP assistant..."}
            className={clsx(
              "flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
              isRecording ? "border-red-300 bg-red-50" : "border-gray-300"
            )}
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
        {isRecording && (
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
            Recording... Click the microphone icon to stop
          </div>
        )}
        {isSpeaking && (
          <div className="mt-2 text-sm text-indigo-600 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            Speaking... Click the volume icon to stop
          </div>
        )}
      </div>
    </div>
  );
};