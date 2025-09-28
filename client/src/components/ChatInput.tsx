import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Send } from 'lucide-react';
import { Message } from './ChatMessage';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendImage: (file: File) => void;
  replyTo?: Message;
  onClearReply: () => void;
  username: string;
}

export default function ChatInput({ onSendMessage, onSendImage, replyTo, onClearReply, username }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (replyTo) onClearReply();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onSendImage(file);
      if (replyTo) onClearReply();
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Handle @ mentions (basic implementation)
    if (value.includes('@')) {
      setIsTyping(true);
      // Note: Mention suggestions feature available for future enhancement
    } else {
      setIsTyping(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-card border-t border-border p-4">
      {/* Reply indicator */}
      {replyTo && (
        <div className="mb-3 flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Replying to</span>
            <span className="text-sm font-medium text-foreground">@{replyTo.username}</span>
            <span className="text-sm text-muted-foreground truncate max-w-32">
              {replyTo.content?.substring(0, 30)}...
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearReply}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-clear-reply"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Anti-spam indicator */}
      {isTyping && (
        <div className="mb-2 text-xs text-muted-foreground">
          @ mention detected - suggestions available in future versions
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Image upload */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleImageClick}
          className="flex-shrink-0 rounded-xl border-2 hover:border-accent hover-elevate"
          data-testid="button-upload-image"
        >
          <Plus className="w-5 h-5" />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          data-testid="input-image-file"
        />

        {/* Message input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={handleInputChange}
            placeholder={replyTo ? `Reply to @${replyTo.username}...` : `Message as ${username}...`}
            className="rounded-2xl border-2 py-6 px-4 focus:border-accent transition-colors resize-none"
            maxLength={500}
            data-testid="input-message"
          />
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim()}
          size="icon"
          className="flex-shrink-0 rounded-xl hover-elevate"
          data-testid="button-send"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}