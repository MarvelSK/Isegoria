import { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatRoomProps {
  username: string;
}

export default function ChatRoom({ username }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  const [activeUsers] = useState(Math.floor(Math.random() * 50) + 10); // Mock active users
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        username: 'Welcome_Bot',
        content: `Welcome to Isegoria, ${username}! Feel free to share your thoughts.`,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isOwn: false
      },
      {
        id: '2',
        username: 'Anonymous_Voice',
        content: 'Great to see new people joining the conversation!',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        isOwn: false
      }
    ];
    setMessages(initialMessages);
  }, [username]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      content,
      timestamp: new Date(),
      isOwn: true,
      replyTo: replyTo && replyTo.content ? {
        id: replyTo.id,
        username: replyTo.username,
        content: replyTo.content
      } : undefined
    };

    console.log('New message sent:', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setReplyTo(undefined);

    // Simulate anti-spam delay
    setTimeout(() => {
      console.log('Message processed');
    }, 100);
  };

  const handleSendImage = (file: File) => {
    // Create a mock image URL (in real app, this would be uploaded to server)
    const imageUrl = URL.createObjectURL(file);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      image: imageUrl,
      timestamp: new Date(),
      isOwn: true,
      replyTo: replyTo && replyTo.content ? {
        id: replyTo.id,
        username: replyTo.username,
        content: replyTo.content
      } : undefined
    };

    console.log('New image message sent:', file.name);
    setMessages(prev => [...prev, newMessage]);
    setReplyTo(undefined);
  };

  const handleReply = (message: Message) => {
    console.log('Reply to message:', message.id);
    setReplyTo(message);
  };

  const handleClearReply = () => {
    console.log('Reply cleared');
    setReplyTo(undefined);
  };

  return (
    <div className="h-screen flex flex-col bg-background" data-testid="page-chat-room">
      {/* Header */}
      <ChatHeader activeUsers={activeUsers} />
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20" data-testid="text-no-messages">
            No messages yet. Start the conversation!
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
      />
    </div>
  );
}