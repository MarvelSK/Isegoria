import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NameEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
  isLoading?: boolean;
}

export default function NameEntryModal({ isOpen, onClose, onSubmit, isLoading = false }: NameEntryModalProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      console.log('Username submitted:', username.trim());
      onSubmit(username.trim());
      setUsername('');
    }
  };

  const handleClose = () => {
    console.log('Name entry modal closed');
    setUsername('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border border-card-border rounded-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground" data-testid="title-name-entry">
            Type a name, any name
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name..."
            className="text-center text-lg py-6 rounded-xl border-2 focus:border-accent transition-colors"
            maxLength={50}
            data-testid="input-username"
            autoFocus
          />
          
          <Button 
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full py-6 text-lg rounded-xl hover-elevate"
            data-testid="button-continue"
          >
            {isLoading ? 'Registering...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}