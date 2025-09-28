import { useState } from 'react';
import { Button } from '@/components/ui/button';
import NameEntryModal from '../NameEntryModal';

export default function NameEntryModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (username: string) => {
    console.log('Username entered:', username);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Name Entry Modal Example</h2>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        
        <NameEntryModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}