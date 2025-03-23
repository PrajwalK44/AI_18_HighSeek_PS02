import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User as UserIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [manualVoiceMode, setManualVoiceMode] = useState(false);

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

      recognitionRef.current.onresult = (event: any) => {
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

      recognitionRef.current.onerror = (event: any) => {
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

      recognition.onresult = function (event) {
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

      recognition.onerror = function (event) {
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        source: data.source,
        confidence: data.confidence,
      };

      setMessages((prev) => [...prev, assistantMessage]);
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

    utterance.onerror = (event) => {
      console.error("Speech synthesis error", event);
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    setIsSpeaking(true);
    setCurrentSpeakingId(message.id);
    speechSynthesis.speak(utterance);
  };

  // Initial welcome message
  useEffect(() => {
    const initialMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Hello ${user.username}! I'm your AI assistant for ${user.department}. How can I help you today?`,
      timestamp: new Date().toISOString(),
    };

    setMessages([initialMessage]);
  }, [user]);

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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-6 h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)]">
      <div className="chat-container h-full bg-card rounded-lg overflow-hidden">
        <div className="chat-header">
          <div className="flex items-center">
            <Bot className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            <h2 className="text-base sm:text-lg font-medium">Core Connect</h2>
          </div>
          <div className="text-xs sm:text-sm opacity-80">
            Connected to {user.department} Department
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                "message",
                message.role === "assistant" ? "bot-message" : "user-message",
                message.isError && "bg-destructive text-destructive-foreground"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center text-xs opacity-70">
                  {message.role === "assistant" ? (
                    <Bot className="mr-1 h-3 w-3" />
                  ) : (
                    <UserIcon className="mr-1 h-3 w-3" />
                  )}
                  {format(new Date(message.timestamp), "HH:mm")}
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

              <div className="prose prose-sm max-w-full break-words">
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
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="suggestions-container">
          <div className="flex gap-2 w-full overflow-x-auto pb-1">
            {getSuggestions().map((suggestion, i) => (
              <button
                key={i}
                className="suggestion flex-shrink-0"
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
              className="icon-btn-primary ml-1 p-1 sm:p-2 rounded-r-lg"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
