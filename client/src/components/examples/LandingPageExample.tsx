import { useState } from 'react';
import LandingPage from '../LandingPage';

export default function LandingPageExample() {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [username, setUsername] = useState('');

  const handleEnterChat = (enteredUsername: string) => {
    setUsername(enteredUsername);
    setCurrentView('chat');
  };

  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Isegoria, {username}!</h2>
          <p className="text-muted-foreground">Chat interface would appear here.</p>
        </div>
      </div>
    );
  }

  return <LandingPage onEnterChat={handleEnterChat} />;
}