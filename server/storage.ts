import { type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

// Anti-spam tracking
interface UserSpamData {
  messageCount: number;
  lastReset: number;
  lastMessageTime: number;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserBySessionId(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnlineStatus(username: string, isOnline: boolean): Promise<void>;
  getActiveUsersCount(): Promise<number>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(limit?: number, offset?: number): Promise<Message[]>;
  getMessageById(id: string): Promise<Message | undefined>;
  
  // Anti-spam methods
  checkRateLimit(username: string): Promise<boolean>;
  recordMessage(username: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;
  private userSpamData: Map<string, UserSpamData>;
  private readonly RATE_LIMIT_MESSAGES = 10; // messages per minute
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms
  private readonly MIN_MESSAGE_INTERVAL = 1000; // 1 second between messages

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userSpamData = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserBySessionId(sessionId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.sessionId === sessionId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser,
      sessionId: insertUser.sessionId || null,
      id,
      isOnline: true,
      lastSeen: now,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserOnlineStatus(username: string, isOnline: boolean): Promise<void> {
    const user = await this.getUserByUsername(username);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.users.set(user.id, user);
    }
  }

  async getActiveUsersCount(): Promise<number> {
    return Array.from(this.users.values()).filter(user => user.isOnline).length;
  }

  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      content: insertMessage.content || null,
      imageUrl: insertMessage.imageUrl || null,
      replyToId: insertMessage.replyToId || null,
      replyToUsername: insertMessage.replyToUsername || null,
      replyToContent: insertMessage.replyToContent || null,
      id,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(limit: number = 50, offset: number = 0): Promise<Message[]> {
    const allMessages = Array.from(this.messages.values())
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
    
    return allMessages.slice(offset, offset + limit);
  }

  async getMessageById(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  // Anti-spam methods
  async checkRateLimit(username: string): Promise<boolean> {
    const now = Date.now();
    const userData = this.userSpamData.get(username) || {
      messageCount: 0,
      lastReset: now,
      lastMessageTime: 0
    };

    // Reset count if window has passed
    if (now - userData.lastReset > this.RATE_LIMIT_WINDOW) {
      userData.messageCount = 0;
      userData.lastReset = now;
    }

    // Check if too soon after last message
    if (now - userData.lastMessageTime < this.MIN_MESSAGE_INTERVAL) {
      return false;
    }

    // Check if exceeds rate limit
    if (userData.messageCount >= this.RATE_LIMIT_MESSAGES) {
      return false;
    }

    this.userSpamData.set(username, userData);
    return true;
  }

  async recordMessage(username: string): Promise<void> {
    const now = Date.now();
    const userData = this.userSpamData.get(username) || {
      messageCount: 0,
      lastReset: now,
      lastMessageTime: 0
    };

    userData.messageCount++;
    userData.lastMessageTime = now;
    this.userSpamData.set(username, userData);
  }
}

export const storage = new MemStorage();
