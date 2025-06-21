export interface Personality {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  background: string;
  greeting: string;
  traits: string[];
  specialties: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personalityId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  personalityId: string;
  personalityName: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}