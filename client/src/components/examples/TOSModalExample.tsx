import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TOSModal from '../TOSModal';

export default function TOSModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Terms of Service Modal Example</h2>
        <Button onClick={() => setIsOpen(true)}>Open TOS Modal</Button>
        
        <TOSModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}