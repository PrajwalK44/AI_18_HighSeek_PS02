"use client";

import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { FiUser, FiDatabase, FiVolume2, FiVolumeX } from "react-icons/fi";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! How can I help with your IDMS ERP queries today? You can ask about inventory, sales, GST returns, or any other ERP data.",
      id: "welcome-message",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(
    null
  );
  const [speechSupported, setSpeechSupported] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);

  // Check if speech synthesis is supported
  useEffect(() => {
    setSpeechSupported("speechSynthesis" in window);

    // Setup speech synthesis voices when they change
    if ("speechSynthesis" in window) {
      const handleVoicesChanged = () => {
        // Just to ensure voices are loaded
        window.speechSynthesis.getVoices();
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

      // Cleanup
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (isSpeaking) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [isSpeaking]);

  const handleSendMessage = (
    userMessage: string,
    assistantResponse: string
  ) => {
    const newMessages = [
      { role: "user", content: userMessage, id: `user-${Date.now()}` },
      {
        role: "assistant",
        content: assistantResponse,
        id: `assistant-${Date.now()}`,
      },
    ];

    setMessages((prev) => [...prev, ...newMessages]);

    // Automatically read the latest response if auto-read is enabled
    if (autoReadEnabled) {
      // Small delay to ensure the message is rendered
      setTimeout(() => {
        speakMessage(assistantResponse, newMessages[1].id);
      }, 500);
    }
  };

  // Helper function to select a preferred voice
  const selectPreferredVoice = (voices: SpeechSynthesisVoice[]) => {
    return (
      voices.find(
        (voice) =>
          voice.name.includes("Google") ||
          voice.name.includes("Natural") ||
          (voice.lang === "en-US" && voice.name.includes("Female"))
      ) ||
      voices.find((voice) => voice.lang === "en-US") ||
      null
    );
  };

  const speakMessage = (text: string, messageId: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthRef.current = utterance;

    // Configure speech parameters
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to select a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = selectPreferredVoice(voices);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      console.error("Speech synthesis error");
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      {/* Chat header with auto-read toggle */}
      <div className="p-3 border-b flex items-center justify-between bg-muted/50">
        <div className="flex items-center">
          <div className="rounded-full bg-primary p-2 text-primary-foreground">
            <FiDatabase className="h-4 w-4" />
          </div>
          <span className="ml-2 text-sm font-medium">IDMS ERP Assistant</span>
        </div>

        {speechSupported && (
          <label className="flex items-center cursor-pointer">
            <span className="text-xs mr-2">Auto-read responses</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={autoReadEnabled}
                onChange={() => setAutoReadEnabled(!autoReadEnabled)}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  autoReadEnabled
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${
                  autoReadEnabled ? "transform translate-x-4" : ""
                }`}
              ></div>
            </div>
          </label>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px] min-h-[300px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <FiDatabase className="h-4 w-4" />
              </div>
            )}

            <div
              className={`rounded-lg px-3 py-2 max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {message.content}
              </pre>

              {/* Text-to-speech controls for assistant messages */}
              {message.role === "assistant" && speechSupported && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() =>
                      currentSpeakingId === message.id
                        ? stopSpeaking()
                        : speakMessage(message.content, message.id)
                    }
                    className={`text-xs p-1 rounded-full hover:bg-background flex items-center gap-1 
                      ${
                        currentSpeakingId === message.id
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    title={
                      currentSpeakingId === message.id
                        ? "Stop speaking"
                        : "Listen to response"
                    }
                  >
                    {currentSpeakingId === message.id ? (
                      <>
                        <FiVolumeX className="h-3 w-3" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <FiVolume2 className="h-3 w-3" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="rounded-full bg-blue-500 p-2 text-white">
                <FiUser className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
