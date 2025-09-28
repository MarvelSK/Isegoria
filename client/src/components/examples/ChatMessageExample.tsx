import { useState } from 'react';
import ChatMessage, { Message } from '../ChatMessage';

export default function ChatMessageExample() {
  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: '1',
      username: 'Anonymous_User',
      content: 'Hello everyone! This is my first message on Isegoria.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isOwn: false
    },
    {
      id: '2',
      username: 'Speaker_42',
      content: 'Welcome! Great to see new voices joining the platform.',
      timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
      isOwn: true
    },
    {
      id: '3',
      username: 'Voice_123',
      content: 'This is a reply to the welcome message.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      isOwn: false,
      replyTo: {
        id: '2',
        username: 'Speaker_42',
        content: 'Welcome! Great to see new voices joining the platform.'
      }
    },
    {
      id: '4',
      username: 'Image_Sharer',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop',
      timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      isOwn: true
    }
  ];

  const [messages] = useState(mockMessages);

  const handleReply = (message: Message) => {
    console.log('Reply to message:', message.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8">Chat Message Examples</h2>
        {messages.map((message) => (
          <ChatMessage 
            key={message.id}
            message={message}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
}