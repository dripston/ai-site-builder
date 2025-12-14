export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  htmlCode?: string;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
}
