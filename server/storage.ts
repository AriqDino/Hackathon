import { chatMessages, chatSessions, type ChatMessage, type ChatSession, type InsertChatMessage, type InsertChatSession } from "@shared/schema";

export interface IStorage {
  // Chat sessions
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSessionLanguage(sessionId: string, language: string): Promise<void>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  getRecentChatMessages(sessionId: string, limit: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage[]>;
  private sessionIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.sessionIdCounter = 1;
    this.messageIdCounter = 1;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      ...insertSession,
      id: this.sessionIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatSessions.set(session.sessionId, session);
    this.chatMessages.set(session.sessionId, []);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async updateChatSessionLanguage(sessionId: string, language: string): Promise<void> {
    const session = this.chatSessions.get(sessionId);
    if (session) {
      session.language = language;
      session.updatedAt = new Date();
      this.chatSessions.set(sessionId, session);
    }
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      ...insertMessage,
      id: this.messageIdCounter++,
      createdAt: new Date(),
    };
    
    const messages = this.chatMessages.get(message.sessionId) || [];
    messages.push(message);
    this.chatMessages.set(message.sessionId, messages);
    
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(sessionId) || [];
  }

  async getRecentChatMessages(sessionId: string, limit: number): Promise<ChatMessage[]> {
    const messages = this.chatMessages.get(sessionId) || [];
    return messages.slice(-limit);
  }
}

export const storage = new MemStorage();
