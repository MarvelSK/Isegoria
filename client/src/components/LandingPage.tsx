import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import NameEntryModal from './NameEntryModal';
import TOSModal from './TOSModal';

interface LandingPageProps {
  onEnterChat: (username: string) => void;
}

export default function LandingPage({ onEnterChat }: LandingPageProps) {
  const [showNameModal, setShowNameModal] = useState(false);
  const [showTOSModal, setShowTOSModal] = useState(false);

  const handleStartSpeaking = () => {
    console.log('Start Speaking clicked');
    setShowNameModal(true);
  };

  const handleNameSubmit = (username: string) => {
    console.log('Name submitted:', username);
    setShowNameModal(false);
    onEnterChat(username);
  };

  const handleTOSClick = () => {
    console.log('TOS clicked');
    setShowTOSModal(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between items-center px-6 py-12">
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="heading-main">
          Your Voice. Your Platform.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg" data-testid="text-tagline">
          Isegoria is a space where every voice matters.
        </p>
        
        <Button 
          onClick={handleStartSpeaking}
          size="lg" 
          className="text-lg px-8 py-6 rounded-xl hover-elevate"
          data-testid="button-start-speaking"
        >
          Start Speaking
        </Button>
      </div>

      {/* Footer with TOS */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          onClick={handleTOSClick}
          className="text-muted-foreground hover:text-accent flex items-center gap-2"
          data-testid="button-tos"
        >
          <Info className="w-4 h-4" />
          Terms of Service
        </Button>
      </div>

      {/* Modals */}
      <NameEntryModal 
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSubmit={handleNameSubmit}
      />
      
      <TOSModal 
        isOpen={showTOSModal}
        onClose={() => setShowTOSModal(false)}
      />
    </div>
  );
}