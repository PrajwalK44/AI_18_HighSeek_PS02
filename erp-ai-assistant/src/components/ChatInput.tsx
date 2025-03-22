"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiMic, FiMicOff } from "react-icons/fi";

// Define the SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define the browser SpeechRecognition interfaces
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Define a type for RecordRTC
type RecordRTCType = any;

interface ChatInputProps {
  onSend?: (message: string, response: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  placeholder = "Type your query about inventory, sales, GST returns, or any ERP data...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  // Use both methods to cover all cases
  const [useBrowserSpeechRecognition, setUseBrowserSpeechRecognition] =
    useState(true);
  const [audioSupported, setAudioSupported] = useState(false);

  // References for both implementations
  const recognitionRef = useRef<any | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<RecordRTCType | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Add a ref to track if RecordRTC is loaded
  const recordRTCLoadedRef = useRef<boolean>(false);

  // Check for browser capabilities on component mount
  useEffect(() => {
    // Dynamically import RecordRTC only on the client side
    const loadRecordRTC = async () => {
      if (typeof window !== "undefined" && !recordRTCLoadedRef.current) {
        try {
          const RecordRTCModule = await import("recordrtc");
          // Store the module in a ref to avoid re-importing
          recordRTCLoadedRef.current = true;
          console.log("RecordRTC loaded successfully");
        } catch (error) {
          console.error("Failed to load RecordRTC:", error);
          // If RecordRTC fails to load, disable the audio recording fallback
          if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            setAudioSupported(false);
          }
        }
      }
    };

    loadRecordRTC();

    // Check for SpeechRecognition API support
    const checkBrowserCapabilities = () => {
      if (typeof window === "undefined") {
        return false; // Server-side rendering, no capabilities available
      }

      // Try browser's speech recognition first
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        console.log("Browser Speech Recognition API is supported");
        setUseBrowserSpeechRecognition(true);
        setAudioSupported(true);
        return true;
      }

      // Fall back to Audio recording API if speech recognition isn't available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Using fallback audio recording method");
        setUseBrowserSpeechRecognition(false);
        setAudioSupported(true);
        return true;
      }

      // No speech recognition capabilities available
      console.log("No speech recognition capabilities available");
      setAudioSupported(false);
      setErrorMessage("Voice recognition is not supported in this browser.");
      return false;
    };

    if (typeof window !== "undefined") {
      checkBrowserCapabilities();
    }

    // Add network status listeners
    const handleOnline = () => {
      if (errorMessage && errorMessage.includes("offline")) {
        setErrorMessage("You're back online. Voice recognition is available.");
        setTimeout(() => setErrorMessage(null), 3000);
      }
    };

    const handleOffline = () => {
      if (isListening) {
        if (useBrowserSpeechRecognition) {
          stopBrowserRecognition();
        } else {
          stopRecording();
        }
      }
      setErrorMessage(
        "You are offline. Voice recognition requires an internet connection."
      );
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (recorderRef.current) {
        recorderRef.current.stopRecording();
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error("Error cleaning up speech recognition:", error);
        }
      }
    };
  }, [errorMessage, isListening, useBrowserSpeechRecognition]);

  // BROWSER SPEECH RECOGNITION IMPLEMENTATION

  // Start the browser's built-in speech recognition
  const startBrowserRecognition = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setErrorMessage("Speech recognition not supported in this browser.");
        return;
      }

      // Create a new recognition instance
      recognitionRef.current = new SpeechRecognition();

      // Configure recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      // Set up event handlers
      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
        setErrorMessage("Listening... Speak now");
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);

        // Submit the form if we have text and recognition completed normally
        if (message.trim() && !errorMessage) {
          setTimeout(() => {
            const formElement = document.querySelector("form");
            if (formElement) {
              formElement.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }
          }, 500);
        }
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";

        // Build the final transcript from all results
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }

        // If we have a final result, set it as the message
        if (finalTranscript) {
          console.log("Final transcript:", finalTranscript);
          setMessage(finalTranscript.trim());
        } else {
          // If no final result yet, show the latest result as the message
          const currentTranscript =
            event.results[event.results.length - 1][0].transcript;
          console.log("Interim transcript:", currentTranscript);
          setMessage(currentTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === "no-speech") {
          setErrorMessage("No speech detected. Please try again.");
        } else if (event.error === "audio-capture") {
          setErrorMessage(
            "No microphone detected. Please check your microphone connection."
          );
        } else if (event.error === "not-allowed") {
          setErrorMessage(
            "Microphone access denied. Please enable microphone permissions."
          );
        } else if (event.error === "network") {
          setErrorMessage(
            "Network error. Please check your internet connection."
          );
        } else if (event.error === "aborted") {
          // Recognition was intentionally stopped
          setErrorMessage(null);
        } else {
          setErrorMessage(
            `Recognition error: ${event.error}. Please try again.`
          );
        }

        stopBrowserRecognition();
      };

      // Start recognition
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setErrorMessage(
        `Failed to start speech recognition: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsListening(false);
    }
  };

  // Stop browser speech recognition
  const stopBrowserRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    setIsListening(false);
  };

  // RECORDRTC IMPLEMENTATION (FALLBACK)

  // Start recording audio
  const startRecording = async () => {
    try {
      if (typeof window === "undefined") {
        return; // Server-side rendering, do nothing
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Audio recording not supported in this browser.");
        return;
      }

      // Dynamically import RecordRTC
      const RecordRTCModule = await import("recordrtc");
      const RecordRTC = RecordRTCModule.default;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create AudioContext
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Configure recorder
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        sampleRate: 44100,
        desiredSampRate: 16000,
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
      });

      // Start recording
      recorderRef.current.startRecording();
      setIsListening(true);
      setErrorMessage("Recording... Speak now");

      // Set a maximum recording time (10 seconds)
      setTimeout(() => {
        if (isListening) {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      console.error("Error starting recording:", error);

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage(
          "Microphone access denied. Please enable microphone permissions."
        );
      } else {
        setErrorMessage(
          `Failed to start recording: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  // Stop recording and process the audio
  const stopRecording = () => {
    if (!recorderRef.current || !streamRef.current) {
      setIsListening(false);
      return;
    }

    setErrorMessage("Processing audio...");

    // Stop the recorder
    recorderRef.current.stopRecording(async () => {
      try {
        // Get the recorded blob
        const audioBlob = recorderRef.current?.getBlob();

        if (!audioBlob) {
          throw new Error("No audio recorded");
        }

        // Clean up
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        // Now convert the audio to text
        await transcribeAudio(audioBlob);
      } catch (error) {
        console.error("Error processing recording:", error);
        setErrorMessage("Error processing voice recording. Please try again.");
      } finally {
        setIsListening(false);
      }
    });
  };

  // Use a custom API endpoint to transcribe the audio
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setErrorMessage("Transcribing audio...");

      // Create form data to send the audio file
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      // For development/testing, you can add a manual text field
      // This will be used instead of actual transcription
      const manualText = "Show inventory levels"; // For testing only
      formData.append("manualText", manualText);

      // Send to our transcribe API endpoint
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result.text) {
        setMessage(result.text);
        setErrorMessage(null);

        // Auto-submit if we got text
        if (result.text.trim()) {
          setTimeout(() => {
            const formElement = document.querySelector("form");
            if (formElement) {
              formElement.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }
          }, 1000);
        }
      } else {
        setErrorMessage("Could not transcribe audio. Please try again.");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      setErrorMessage(
        "Error transcribing audio. Please try typing your query instead."
      );
    }
  };

  // Toggle voice recognition based on current state
  const toggleVoiceRecognition = () => {
    if (isListening) {
      if (useBrowserSpeechRecognition) {
        stopBrowserRecognition();
      } else {
        stopRecording();
      }
    } else {
      if (useBrowserSpeechRecognition) {
        startBrowserRecognition();
      } else {
        startRecording();
      }
    }
  };

  // Retry after error
  const retryVoiceRecognition = () => {
    setErrorMessage(null);

    // Check if online
    if (!navigator.onLine) {
      setErrorMessage(
        "You are offline. Please check your internet connection."
      );
      return;
    }

    // Start voice recognition using the appropriate method
    if (useBrowserSpeechRecognition) {
      startBrowserRecognition();
    } else {
      startRecording();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setIsLoading(true);

      const userMessage = message;
      setMessage(""); // Clear input field immediately

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (onSend) {
        onSend(userMessage, data.response);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (onSend) {
        onSend(
          message,
          "Sorry, I encountered an error processing your request. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isListening
              ? useBrowserSpeechRecognition
                ? "Listening..."
                : "Recording..."
              : placeholder
          }
          className="w-full rounded-full border border-input bg-background px-4 py-3 pr-24 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
          disabled={isLoading || isListening}
        />

        <div className="absolute right-1 flex items-center space-x-1">
          {/* Voice command button */}
          {audioSupported ? (
            <button
              type="button"
              onClick={
                isListening
                  ? toggleVoiceRecognition
                  : errorMessage &&
                    !errorMessage.includes("Processing") &&
                    !errorMessage.includes("Transcribing") &&
                    !errorMessage.includes("Recording") &&
                    !errorMessage.includes("Listening")
                  ? retryVoiceRecognition
                  : toggleVoiceRecognition
              }
              className={`icon-btn icon-btn-mic transition-all duration-300 ${
                isListening
                  ? "listening text-red-500 animate-pulse-custom"
                  : errorMessage &&
                    !errorMessage.includes("Processing") &&
                    !errorMessage.includes("Transcribing") &&
                    !errorMessage.includes("Recording") &&
                    !errorMessage.includes("Listening")
                  ? "text-yellow-500 animate-bounce-custom"
                  : "text-muted-foreground hover:text-primary"
              }`}
              disabled={isLoading}
              aria-label={
                isListening
                  ? useBrowserSpeechRecognition
                    ? "Stop listening"
                    : "Stop recording"
                  : errorMessage &&
                    !errorMessage.includes("Processing") &&
                    !errorMessage.includes("Transcribing") &&
                    !errorMessage.includes("Recording") &&
                    !errorMessage.includes("Listening")
                  ? "Retry voice recognition"
                  : "Start voice recognition"
              }
              title={
                isListening
                  ? useBrowserSpeechRecognition
                    ? "Stop listening"
                    : "Stop recording"
                  : errorMessage &&
                    !errorMessage.includes("Processing") &&
                    !errorMessage.includes("Transcribing") &&
                    !errorMessage.includes("Recording") &&
                    !errorMessage.includes("Listening")
                  ? "Retry voice recognition"
                  : "Start voice recognition"
              }
            >
              {isListening ? (
                <FiMicOff className="h-5 w-5" />
              ) : (
                <FiMic className="h-5 w-5" />
              )}
            </button>
          ) : null}

          {/* Send button */}
          <button
            type="submit"
            className="icon-btn icon-btn-primary rounded-full bg-primary p-2 text-primary-foreground transition-transform duration-200 hover:scale-105 disabled:opacity-50"
            disabled={isLoading || isListening || !message.trim()}
            aria-label="Send message"
            title="Send message"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status message area - for Recording/Listening animation or Error message */}
      <div className="h-5 mt-1 animate-fade-in">
        {isListening ? (
          <div className="flex justify-center animate-slide-up">
            <div className="flex space-x-1">
              <div className="text-xs text-primary">
                {useBrowserSpeechRecognition ? "Listening" : "Recording"}
              </div>
              <div className="flex space-x-1">
                <div className="animate-pulse text-xs text-primary">.</div>
                <div className="animate-pulse text-xs text-primary delay-75">
                  .
                </div>
                <div className="animate-pulse text-xs text-primary delay-150">
                  .
                </div>
              </div>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="flex justify-center items-center gap-2 animate-slide-up">
            <div className="text-xs text-red-500">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setShowTroubleshooting(!showTroubleshooting)}
              className="text-xs underline text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              {showTroubleshooting ? "Hide help" : "Show help"}
            </button>
          </div>
        ) : null}
      </div>

      {/* Troubleshooting help */}
      {showTroubleshooting && (
        <div className="mt-4 p-3 bg-muted rounded-md text-xs animate-fade-in">
          <h4 className="font-medium mb-1">
            Voice Recognition Troubleshooting:
          </h4>
          <ul className="list-disc pl-4 space-y-1">
            <li
              className="animate-slide-right"
              style={{ animationDelay: "0ms" }}
            >
              For best results, use Google Chrome or Microsoft Edge
            </li>
            <li
              className="animate-slide-right"
              style={{ animationDelay: "50ms" }}
            >
              Click "Allow" when your browser asks for microphone permission
            </li>
            <li
              className="animate-slide-right"
              style={{ animationDelay: "100ms" }}
            >
              Ensure you have a working microphone connected
            </li>
            <li
              className="animate-slide-right"
              style={{ animationDelay: "150ms" }}
            >
              Speak clearly at a normal volume
            </li>
            <li
              className="animate-slide-right"
              style={{ animationDelay: "200ms" }}
            >
              Check that your internet connection is stable
            </li>
            <li
              className="animate-slide-right"
              style={{ animationDelay: "250ms" }}
            >
              Try refreshing the page if issues persist
            </li>
            <li
              className="animate-slide-right"
              style={{ animationDelay: "300ms" }}
            >
              For best recognition, speak in clear, complete phrases
            </li>
          </ul>
        </div>
      )}
    </form>
  );
}
