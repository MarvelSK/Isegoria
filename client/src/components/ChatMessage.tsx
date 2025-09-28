import { formatDistanceToNow } from 'date-fns';
import ImageMessage from './ImageMessage';

export interface Message {
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

interface ChatMessageProps {
  message: Message;
  onReply: (message: Message) => void;
}

export default function ChatMessage({ message, onReply }: ChatMessageProps) {
  const handleReply = () => {
    console.log('Reply clicked for message:', message.id);
    onReply(message);
  };

  const handleMention = () => {
    console.log('Mention clicked for user:', message.username);
  };

  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`} data-testid={`message-${message.id}`}>
      <div className={`max-w-xs sm:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
        {/* Reply indicator */}
        {message.replyTo && (
          <div className="text-xs text-muted-foreground mb-1 px-3">
            Replying to @{message.replyTo.username}: {message.replyTo.content.substring(0, 50)}
            {message.replyTo.content.length > 50 && '...'}
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            message.isOwn 
              ? 'bg-self-message text-self-message-foreground' 
              : 'bg-other-message text-other-message-foreground'
          }`}
        >
          {/* Username */}
          <div className="text-sm font-medium mb-1 opacity-90" data-testid={`text-username-${message.id}`}>
            {message.username}
          </div>
          
          {/* Content or Image */}
          {message.image ? (
            <ImageMessage src={message.image} alt="Shared image" />
          ) : (
            <div className="break-words" data-testid={`text-content-${message.id}`}>
              {message.content}
            </div>
          )}
          
          {/* Timestamp and actions */}
          <div className="flex justify-between items-center mt-2 text-xs opacity-70">
            <span data-testid={`text-timestamp-${message.id}`}>
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleMention}
                className="hover:opacity-100 transition-opacity"
                data-testid={`button-mention-${message.id}`}
              >
                @
              </button>
              <button
                onClick={handleReply}
                className="hover:opacity-100 transition-opacity"
                data-testid={`button-reply-${message.id}`}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}