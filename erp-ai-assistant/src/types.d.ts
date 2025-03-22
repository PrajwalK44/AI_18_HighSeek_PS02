// Speech Recognition API types
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;

  // Speech Synthesis API
  speechSynthesis: SpeechSynthesis;
}

// Additional types for TypeScript completeness
interface SpeechSynthesisEventMap {
  voiceschanged: Event;
}

interface SpeechSynthesis extends EventTarget {
  readonly speaking: boolean;
  readonly pending: boolean;
  readonly paused: boolean;
  onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => any) | null;
  getVoices(): SpeechSynthesisVoice[];
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  addEventListener<K extends keyof SpeechSynthesisEventMap>(
    type: K,
    listener: (this: SpeechSynthesis, ev: SpeechSynthesisEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof SpeechSynthesisEventMap>(
    type: K,
    listener: (this: SpeechSynthesis, ev: SpeechSynthesisEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

// Add other global type declarations as needed
