import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMessageSchema, 
  type ClientMessage, 
  type WebSocketEvent 
} from "@shared/schema";
import { randomUUID } from "crypto";

// Multer setup for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// WebSocket client management
interface WSClient {
  ws: WebSocket;
  username: string;
}

const connectedClients = new Map<string, WSClient>();

// Broadcast to all connected clients
function broadcast(event: WebSocketEvent) {
  const message = JSON.stringify(event);
  connectedClients.forEach(({ ws }) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

// Convert database message to client message
function toClientMessage(dbMessage: any, currentUsername?: string): ClientMessage {
  return {
    id: dbMessage.id,
    username: dbMessage.username,
    content: dbMessage.content || undefined,
    image: dbMessage.imageUrl || undefined,
    timestamp: new Date(dbMessage.timestamp),
    isOwn: currentUsername === dbMessage.username,
    replyTo: dbMessage.replyToId ? {
      id: dbMessage.replyToId,
      username: dbMessage.replyToUsername || '',
      content: dbMessage.replyToContent || ''
    } : undefined
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User management routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const sessionId = randomUUID();
      
      // Check if username is already taken
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const user = await storage.createUser({
        ...userData,
        sessionId
      });

      res.json({ user, sessionId });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/active", async (req, res) => {
    try {
      const count = await storage.getActiveUsersCount();
      res.json({ count });
    } catch (error) {
      console.error('Error getting active users:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Message routes
  app.get("/api/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const username = req.query.username as string;
      
      const messages = await storage.getMessages(limit, offset);
      const clientMessages = messages.map(msg => toClientMessage(msg, username));
      
      res.json({ messages: clientMessages });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Check rate limit
      const canSend = await storage.checkRateLimit(messageData.username);
      if (!canSend) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      // Record message for rate limiting
      await storage.recordMessage(messageData.username);

      // Create message
      const message = await storage.createMessage(messageData);
      const clientMessage = toClientMessage(message, messageData.username);

      // Broadcast to all connected clients
      broadcast({
        type: 'new_message',
        message: clientMessage
      });

      res.json({ message: clientMessage });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Image upload route
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const username = req.body.username;
      if (!username) {
        return res.status(400).json({ error: "Username required" });
      }

      // Check rate limit
      const canSend = await storage.checkRateLimit(username);
      if (!canSend) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      // In a real app, you'd upload to cloud storage
      // For now, we'll create a data URL
      const base64 = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

      // Record message for rate limiting
      await storage.recordMessage(username);

      // Create image message
      const messageData = {
        username,
        imageUrl,
        replyToId: req.body.replyToId || undefined,
        replyToUsername: req.body.replyToUsername || undefined,
        replyToContent: req.body.replyToContent || undefined
      };

      const message = await storage.createMessage(messageData);
      const clientMessage = toClientMessage(message, username);

      // Broadcast to all connected clients
      broadcast({
        type: 'new_message',
        message: clientMessage
      });

      res.json({ message: clientMessage });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server setup (following blueprint instructions)
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    let clientInfo: WSClient | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'user_join') {
          const { username, sessionId } = message;
          
          // Verify session
          const user = await storage.getUserBySessionId(sessionId);
          if (!user || user.username !== username) {
            ws.close(1008, 'Invalid session');
            return;
          }

          // Update user online status
          await storage.updateUserOnlineStatus(username, true);
          
          // Store client info
          clientInfo = { ws, username };
          connectedClients.set(sessionId, clientInfo);

          // Send current active user count
          const activeUsers = await storage.getActiveUsersCount();
          
          // Broadcast user joined
          broadcast({
            type: 'user_joined',
            username,
            activeUsers
          });

          // Send recent messages to new user
          const messages = await storage.getMessages(20);
          const clientMessages = messages.map(msg => toClientMessage(msg, username));
          
          ws.send(JSON.stringify({
            type: 'message_history',
            messages: clientMessages
          }));

        } else if (message.type === 'heartbeat') {
          // Respond to heartbeat
          ws.send(JSON.stringify({ type: 'heartbeat_ack' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', async () => {
      console.log('WebSocket connection closed');
      
      if (clientInfo) {
        // Remove from connected clients
        for (const [sessionId, client] of Array.from(connectedClients.entries())) {
          if (client === clientInfo) {
            connectedClients.delete(sessionId);
            break;
          }
        }

        // Update user offline status
        await storage.updateUserOnlineStatus(clientInfo.username, false);
        
        // Get updated active user count
        const activeUsers = await storage.getActiveUsersCount();
        
        // Broadcast user left
        broadcast({
          type: 'user_left',
          username: clientInfo.username,
          activeUsers
        });
      }
    });

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'heartbeat' }));
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);
  });

  return httpServer;
}
