export interface User {
  username: string;
  department: string;
  role: 'admin' | 'user';
  password?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  department: string;
  tags: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  source: 'knowledge_base' | 'erp' | 'escalated' | 'llm' | 'error';
  response: string;
  confidence?: number;
}

export interface Escalation {
  query: string;
  user: string;
  timestamp: string;
}

export interface ERPData {
  status: string;
  data: string;
}

export interface UserMetrics {
  department: string;
  queries: number;
}