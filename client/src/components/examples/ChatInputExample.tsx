import { useState } from 'react';
import ChatInput from '../ChatInput';
import { Message } from '../ChatMessage';

export default function ChatInputExample() {
  const [replyTo, setReplyTo] = useState<Message | undefined>();
  
  // Mock reply message
  const mockReplyMessage: Message = {
    id: '1',
    username: 'Another_User',
    content: 'This is a message that someone might reply to.',
    timestamp: new Date(),
    isOwn: false
  };

  const handleSendMessage = (content: string) => {
    console.log('Message sent:', content);
    setReplyTo(undefined);
  };

  const handleSendImage = (file: File) => {
    console.log('Image sent:', file.name);
    setReplyTo(undefined);
  };

  const handleClearReply = () => {
    console.log('Reply cleared');
    setReplyTo(undefined);
  };

  const simulateReply = () => {
    setReplyTo(mockReplyMessage);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Chat Input Examples</h2>
          <div className="space-x-4">
            <button 
              onClick={() => setReplyTo(undefined)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Normal Input
            </button>
            <button 
              onClick={simulateReply}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg"
            >
              Reply Mode
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border">
        <ChatInput 
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          replyTo={replyTo}
          onClearReply={handleClearReply}
          username="YourName"
        />
      </div>
    </div>
  );
}