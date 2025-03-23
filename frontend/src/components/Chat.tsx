import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User as UserIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  History,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { Message, ChatResponse, User } from "../types";
import clsx from "clsx";

// Type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }

  // Add interface for SpeechRecognitionEvent
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
    interpretation: any;
  }

  // Add interface for SpeechRecognitionErrorEvent
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

// Adding type for chat history items
interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Message[];
}

interface ChatProps {
  user: User;
  onLogout: () => void;
}

export const Chat: React.FC<ChatProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(
    null
  );
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  // Changed to true to make sidebar visible by default
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [manualVoiceMode, setManualVoiceMode] = useState(false);

  // Create a user ID from username and department (same format as backend)
  const userId = `${user.username.toLowerCase()}_${user.department.toLowerCase()}`;

  useEffect(() => {
    // We'll always set recognitionSupported to true to show the icon
    setRecognitionSupported(true);

    // Check if SpeechRecognition is supported
    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.log("Speech recognition not supported in this browser");
      // We don't set recognitionSupported to false anymore
      // Instead, we'll handle this in the toggleRecording function
      return;
    }

    // Setup Speech Recognition
    try {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false; // Changed to false for better control
      recognitionRef.current.interimResults = false; // Changed to false for better reliability
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.maxAlternatives = 1;

      // Add these lines to improve network reliability
      // Shorter phrases are easier to process and less likely to hit network timeouts
      recognitionRef.current.grammars = undefined; // Don't restrict grammar
      // Shorter timeout before giving up on speech input
      if (typeof recognitionRef.current.audioTimeout !== "undefined") {
        recognitionRef.current.audioTimeout = 5000; // 5 seconds
      }

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        console.log("Speech recognition result received", event);
        // Get the most recent result
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        // Log for debugging
        console.log("Transcript detected:", transcript);

        // Update the input field with the transcribed text
        setInput((prev) => prev + " " + transcript.trim());

        // Auto-stop after result to prevent hanging
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log("Error stopping after result:", err);
        }
      };

      recognitionRef.current.onspeechend = () => {
        console.log("Speech segment ended");
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);

        // Handle different error types
        if (event.error === "not-allowed") {
          alert(
            "Microphone access was denied. Please allow microphone access to use voice commands."
          );
        } else if (event.error === "no-speech") {
          // No need to alert for no speech detected
          console.log("No speech detected");
        } else if (event.error === "network") {
          // Don't alert for network errors, just log and reset
          console.log(
            "Network error in speech recognition - try speaking more clearly or check connection"
          );
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }

        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition session ended");
        setIsRecording(false);
      };
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setRecognitionSupported(false);
    }

    // Setup speech synthesis event handlers
    if ("speechSynthesis" in window) {
      speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all chat histories for the user
  const fetchAllChatHistories = async () => {
    setIsLoadingHistory(true);
    try {
      // Implement a solution using the single chat history endpoint
      // Since we don't have a direct endpoint for all histories, we'll create mock histories

      // First get the current chat history
      const response = await fetch(
        `http://127.0.0.1:8003/chat-history/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Create a history item from the current chat
      const chatHistory: ChatHistoryItem = {
        id: data._id || "current",
        title: generateChatTitle(data.messages),
        preview: generateChatPreview(data.messages),
        timestamp: data.last_updated || new Date().toISOString(),
        messages: data.messages || [],
      };

      // For now, just set this as the only chat history
      // In a real implementation, we would fetch multiple chat histories
      setChatHistories([chatHistory]);
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      setChatHistories([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Generate a title for chat history
  const generateChatTitle = (chatMessages: Message[]) => {
    if (!chatMessages || chatMessages.length === 0) {
      return "New Conversation";
    }

    // Find first user message
    const firstUserMessage = chatMessages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      // Truncate to first 20 characters
      return firstUserMessage.content.length > 20
        ? firstUserMessage.content.substring(0, 20) + "..."
        : firstUserMessage.content;
    }

    return "Conversation " + new Date().toLocaleDateString();
  };

  // Generate preview for chat history
  const generateChatPreview = (chatMessages: Message[]) => {
    if (!chatMessages || chatMessages.length === 0) {
      return "No messages";
    }

    // Get last message
    const lastMessage = chatMessages[chatMessages.length - 1];
    return lastMessage.content.length > 40
      ? lastMessage.content.substring(0, 40) + "..."
      : lastMessage.content;
  };

  // Load chat history by ID (in this case, we only have one chat)
  const loadChatHistory = async (chatId: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8003/chat-history/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Set current chat ID
      setCurrentChatId(data._id || "current");

      // Convert the chat history messages
      if (data && data.messages && Array.isArray(data.messages)) {
        setMessages(
          data.messages.map((msg: any, index: number) => ({
            id: `history-${index}-${Date.now()}`,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            source: msg.source,
            confidence: msg.confidence,
            isError: msg.isError,
          }))
        );
      }

      // Close the sidebar on mobile after loading a chat
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Start a new conversation (clear messages)
  const startNewConversation = async () => {
    const initialMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Hello ${user.username}! I'm your AI assistant for ${user.department}. How can I help you today?`,
      timestamp: new Date().toISOString(),
    };

    setMessages([initialMessage]);
    setCurrentChatId("current");

    // Close the sidebar on mobile after starting a new chat
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // After creating a new conversation, refresh the chat histories
    fetchAllChatHistories();
  };

  const toggleRecording = () => {
    // If already recording, stop it
    if (isRecording) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
        setIsRecording(false);
      }
      return;
    }

    // Start new recording session
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          "Speech recognition is not supported in your browser. Please try Chrome."
        );
        return;
      }

      // Create a fresh instance each time to avoid state issues
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false; // Ensure this is false for better reliability
      recognition.interimResults = false; // Only return final results for better stability
      recognition.maxAlternatives = 1;

      // Add shorter timeouts
      if (typeof recognition.audioTimeout !== "undefined") {
        recognition.audioTimeout = 5000; // 5 seconds
      }

      recognition.onresult = function (event: SpeechRecognitionEvent) {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;

        console.log("Speech recognized:", text);
        setInput((current) => current + " " + text.trim());

        // Auto-stop after result to prevent hanging
        try {
          recognition.stop();
        } catch (err) {
          console.log("Error stopping after result:", err);
        }
      };

      recognition.onerror = function (event: SpeechRecognitionErrorEvent) {
        console.error("Speech recognition error:", event.error);

        if (event.error === "network") {
          console.log("Network error - trying with shorter phrase next time");
          // Don't show alert for network errors as they're common
        } else if (event.error === "not-allowed") {
          alert(
            "Microphone access was denied. Please allow microphone access."
          );
        } else if (event.error !== "no-speech") {
          // Don't alert for no-speech as it's common
          alert(`Speech recognition error: ${event.error}`);
        }

        setIsRecording(false);
      };

      recognition.onend = function () {
        console.log("Speech recognition session ended");
        setIsRecording(false);
      };

      // Store and start
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);

      // Safety timeout - force stop after 10 seconds if no result or error
      setTimeout(() => {
        if (isRecording) {
          try {
            recognition.stop();
          } catch (err) {
            console.log("Error in safety timeout stop:", err);
          }
          setIsRecording(false);
        }
      }, 10000);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      alert(
        "Could not start speech recognition. Please try again or use a different browser."
      );
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // If recording is active, end it first
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping recording before send:", error);
        }
      }
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8003/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          department: user.department,
          username: user.username, // Include username for proper chat history tracking
          user_id: userId, // Include the user ID
          chat_id: currentChatId, // Include current chat ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // Format the response based on source
      let formattedResponse = data.response;

      // Add better formatting for different response types
      if (data.source === "knowledge_base") {
        // Keep knowledge base responses as is
        formattedResponse = data.response;
      } else if (data.source === "escalated") {
        // Format escalated responses clearly
        const parts = data.response.split("Initial AI response:");
        if (parts.length > 1) {
          formattedResponse = `This query has been escalated to the support team.\n\nInitial response:\n${parts[1].trim()}`;
        }
      } else if (data.source === "erp") {
        // Add better structure to ERP data responses
        formattedResponse = data.response.replace(/(\d+\.\s)/g, "\n$1");
      } else if (data.source === "llm") {
        // Improve LLM response formatting with paragraph breaks
        formattedResponse = data.response
          .replace(/\n\n/g, "\n") // Remove excessive newlines
          .replace(/\.\s/g, ".\n"); // Add line breaks after periods for readability
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: formattedResponse,
        timestamp: new Date().toISOString(),
        source: data.source,
        confidence: data.confidence,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh chat histories after sending a message
      fetchAllChatHistories();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const playMessage = (message: Message) => {
    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported");
      return;
    }

    // Stop any current speech
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    if (message.role !== "assistant") return;

    const utterance = new SpeechSynthesisUtterance(message.content);
    speechSynthesisRef.current = utterance;

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error("Speech synthesis error", event);
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    setIsSpeaking(true);
    setCurrentSpeakingId(message.id);
    speechSynthesis.speak(utterance);
  };

  // Placeholder suggestions based on user department
  const getSuggestions = () => {
    switch (user.department) {
      case "HR":
        return [
          "Employee benefits policy",
          "Onboarding process",
          "Request time off",
          "Performance review guidelines",
        ];
      case "Sales":
        return [
          "Q2 sales targets",
          "Customer success stories",
          "Product pricing",
          "Commission structure",
        ];
      case "Finance":
        return [
          "Expense reports",
          "Financial forecasts",
          "Budgeting process",
          "P&L statement",
        ];
      default:
        return [
          "How can you help me?",
          "What data do you have access to?",
          "Show me system status",
          "Generate a report",
        ];
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // If opening sidebar, refresh chat histories
    if (!sidebarOpen) {
      fetchAllChatHistories();
    }
  };

  // Load chat history on initial render and fetch all histories
  useEffect(() => {
    // Initial load of chat history
    const fetchInitialChatHistory = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8003/chat-history/${userId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            // New user, create a welcome message
            const initialMessage: Message = {
              id: "welcome",
              role: "assistant",
              content: `Hello ${user.username}! I'm your AI assistant for ${user.department}. How can I help you today?`,
              timestamp: new Date().toISOString(),
            };
            setMessages([initialMessage]);
            setCurrentChatId("current");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Set current chat ID
        setCurrentChatId(data._id || "current");

        // Convert the chat history messages
        if (data && data.messages && Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg: any, index: number) => ({
              id: `history-${index}-${Date.now()}`,
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
              source: msg.source,
              confidence: msg.confidence,
              isError: msg.isError,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching initial chat history:", error);
        // Show a welcome message for any error
        const initialMessage: Message = {
          id: "welcome",
          role: "assistant",
          content: `Hello ${user.username}! I'm your AI assistant for ${user.department}. How can I help you today?`,
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMessage]);
        setCurrentChatId("current");
      }
    };

    fetchInitialChatHistory();
    fetchAllChatHistories();
  }, [userId, user.username, user.department]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-6 h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] flex">
      {/* Chat History Sidebar */}
      <div
        className={clsx(
          "sidebar-container transition-all duration-300 ease-in-out border-r border-border bg-background",
          sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-3 border-b border-border flex justify-between items-center">
          <div className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            <h3 className="text-sm font-medium">Chat History</h3>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={startNewConversation}
            className="w-full flex items-center p-2 mb-4 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center p-4">
              <div className="loader"></div>
              <span className="ml-2 text-xs text-muted-foreground">
                Loading history...
              </span>
            </div>
          ) : chatHistories.length === 0 ? (
            <div className="text-center p-4 text-sm text-muted-foreground">
              No chat history found
            </div>
          ) : (
            chatHistories.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChatHistory(chat.id)}
                className={clsx(
                  "p-3 cursor-pointer hover:bg-secondary/50 transition-colors border-b border-border",
                  currentChatId === chat.id && "bg-secondary/70"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm truncate max-w-[80%]">
                    {chat.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {chat.preview}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Container */}
      <div
        className={clsx(
          "chat-container transition-all duration-300 h-full bg-card rounded-lg overflow-hidden flex-1 flex flex-col",
          sidebarOpen ? "ml-4" : "ml-0"
        )}
      >
        <div className="chat-header border-b border-border p-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="mr-2 p-1 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  title="Show Chat History"
                >
                  <History className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              <Bot className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              <h2 className="text-base sm:text-lg font-medium">Core Connect</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs sm:text-sm opacity-80">
                {user.username} - {user.department} Department
              </div>
              <button
                onClick={startNewConversation}
                className="p-1 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
                title="Start New Chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="chat-messages flex-1 overflow-y-auto p-3">
          {isLoadingHistory && (
            <div className="flex justify-center items-center p-4">
              <div className="loader"></div>
              <span className="ml-2 text-sm text-muted-foreground">
                Loading conversation history...
              </span>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                "message p-3 rounded-lg mb-3",
                message.role === "assistant"
                  ? "bg-secondary/50 text-foreground"
                  : "bg-primary/10 text-foreground ml-auto max-w-[80%]",
                message.isError && "bg-destructive text-destructive-foreground",
                message.source === "escalated" &&
                  "bg-red-100 dark:bg-red-900 border-l-4 border-red-500"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center text-xs opacity-70">
                  {message.role === "assistant" ? (
                    <Bot className="mr-1 h-3 w-3" />
                  ) : (
                    <UserIcon className="mr-1 h-3 w-3" />
                  )}
                  {format(new Date(message.timestamp), "HH:mm • MMM d")}
                  {message.source === "escalated" && (
                    <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">
                      Escalated
                    </span>
                  )}
                </div>

                {message.role === "assistant" && (
                  <button
                    onClick={() => playMessage(message)}
                    className="icon-btn -mt-1 -mr-1 p-1"
                    title={
                      isSpeaking && currentSpeakingId === message.id
                        ? "Stop speaking"
                        : "Read aloud"
                    }
                  >
                    {isSpeaking && currentSpeakingId === message.id ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>

              <div
                className={clsx(
                  "prose prose-sm max-w-full break-words whitespace-pre-wrap",
                  message.source === "escalated" &&
                    "text-red-700 dark:text-red-300 font-medium"
                )}
              >
                {message.content}
              </div>

              {message.source && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="font-medium">Source: {message.source}</div>
                  {message.confidence && (
                    <div>
                      Confidence: {(message.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="typing-indicator p-3 bg-secondary/30 rounded-lg inline-flex space-x-1 ml-2 mb-3">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="suggestions-container px-3 py-2 border-t border-border">
          <div className="flex gap-2 w-full overflow-x-auto pb-1">
            {getSuggestions().map((suggestion, i) => (
              <button
                key={i}
                className="suggestion px-3 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-full whitespace-nowrap transition-colors"
                onClick={() => {
                  setInput(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2 sm:p-4 border-t border-border bg-card">
          {isRecording && (
            <div className="mb-2 text-center text-xs sm:text-sm text-destructive animate-pulse font-medium">
              Recording... Click microphone when done speaking
            </div>
          )}
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 sm:px-4 py-2 bg-background border border-input rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Type your message..."
              disabled={isLoading}
            />

            {/* Always show mic button regardless of recognition support */}
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={clsx(
                "px-2 sm:px-3 py-2 border border-input border-l-0 bg-background hover:bg-secondary/50 transition-colors",
                isRecording && "bg-destructive/10 border-destructive"
              )}
              title={
                isRecording
                  ? "Stop recording and enter text"
                  : "Start voice input mode"
              }
            >
              {isRecording ? (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5 text-destructive animate-pulse" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              )}
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="icon-btn-primary ml-1 p-1 sm:p-2 rounded-r-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};