import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for chat platform
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  sessionId: text("session_id"),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table for chat history
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  replyToId: varchar("reply_to_id"),
  replyToUsername: text("reply_to_username"),
  replyToContent: text("reply_to_content"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  sessionId: true,
});

export const selectUserSchema = createInsertSchema(users);

// Message schemas
export const insertMessageSchema = createInsertSchema(messages).pick({
  username: true,
  content: true,
  imageUrl: true,
  replyToId: true,
  replyToUsername: true,
  replyToContent: true,
});

export const selectMessageSchema = createInsertSchema(messages);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Client-side message interface (matches frontend)
export interface ClientMessage {
  id: string;
  username: string;
  content?: string;
  image?: string;
  timestamp: Date;
  isOwn: boolean;
  replyTo?: {
    id: string;
    username: string;
    content: string;
  };
}

// WebSocket event types
export type WebSocketEvent = 
  | { type: 'user_joined'; username: string; activeUsers: number }
  | { type: 'user_left'; username: string; activeUsers: number }
  | { type: 'new_message'; message: ClientMessage }
  | { type: 'active_users_count'; count: number };
