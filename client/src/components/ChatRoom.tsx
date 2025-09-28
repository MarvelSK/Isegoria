import { useState, useRef, useEffect, useCallback } from 'react';
import { ClientMessage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';
import { sendMessage, uploadImage, getMessages, isApiError } from '@/lib/api';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatRoomProps {
  username: string;
  sessionId: string;
}

export default function ChatRoom({ username, sessionId }: ChatRoomProps) {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [replyTo, setReplyTo] = useState<ClientMessage | undefined>();
  const [activeUsers, setActiveUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const initialMessages = await getMessages(username, 20);
        setMessages(initialMessages.reverse()); // Reverse to show oldest first
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load message history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [username, toast]);

  // WebSocket event handlers
  const handleNewMessage = useCallback((message: ClientMessage) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const handleUserJoined = useCallback((joinedUsername: string, count: number) => {
    setActiveUsers(count);
    if (joinedUsername !== username) {
      toast({
        title: "User Joined",
        description: `${joinedUsername} joined the chat`,
      });
    }
  }, [username, toast]);

  const handleUserLeft = useCallback((leftUsername: string, count: number) => {
    setActiveUsers(count);
    if (leftUsername !== username) {
      toast({
        title: "User Left",
        description: `${leftUsername} left the chat`,
      });
    }
  }, [username, toast]);

  const handleActiveUsersUpdate = useCallback((count: number) => {
    setActiveUsers(count);
  }, []);

  // WebSocket connection
  const { isConnected, connectionError, reconnect } = useWebSocket({
    username,
    sessionId,
    onMessage: handleNewMessage,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
    onActiveUsersUpdate: handleActiveUsersUpdate,
  });

  // Update connection status
  useEffect(() => {
    if (connectionError) {
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Error",
        description: connectionError,
        variant: "destructive",
      });
    } else if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('connecting');
    }
  }, [isConnected, connectionError, toast]);

  const handleSendMessage = async (content: string) => {
    try {
      // The message will be broadcast via WebSocket, so we don't need to add it locally
      await sendMessage(username, content, replyTo && replyTo.content ? {
        id: replyTo.id,
        username: replyTo.username,
        content: replyTo.content
      } : undefined);
      
      setReplyTo(undefined);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: isApiError(error) ? error.message : "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleSendImage = async (file: File) => {
    try {
      // The image message will be broadcast via WebSocket
      await uploadImage(file, username, replyTo && replyTo.content ? {
        id: replyTo.id,
        username: replyTo.username,
        content: replyTo.content
      } : undefined);
      
      setReplyTo(undefined);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: isApiError(error) ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleReply = (message: ClientMessage) => {
    console.log('Reply to message:', message.id);
    setReplyTo(message);
  };

  const handleClearReply = () => {
    console.log('Reply cleared');
    setReplyTo(undefined);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg font-medium text-foreground mb-2">Loading Isegoria...</div>
          <div className="text-sm text-muted-foreground">Connecting to the platform</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background" data-testid="page-chat-room">
      {/* Connection status bar */}
      {connectionStatus !== 'connected' && (
        <div className={`px-4 py-2 text-center text-sm ${
          connectionStatus === 'connecting' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {connectionStatus === 'connecting' ? (
            'Connecting to Isegoria...'
          ) : (
            <span>
              Connection lost. 
              <button 
                onClick={reconnect}
                className="ml-2 underline hover:no-underline"
              >
                Reconnect
              </button>
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <ChatHeader activeUsers={activeUsers} />
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20" data-testid="text-no-messages">
            {connectionStatus === 'connected' 
              ? "No messages yet. Start the conversation!" 
              : "Loading messages..."}
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onReply={handleReply}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        replyTo={replyTo}
        onClearReply={handleClearReply}
        username={username}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
}