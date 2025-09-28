import { useState } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/components/LandingPage";
import ChatRoom from "@/components/ChatRoom";
import NotFound from "@/pages/not-found";

function IsegoriaPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [username, setUsername] = useState<string>('');

  const handleEnterChat = (enteredUsername: string) => {
    console.log('User entering chat:', enteredUsername);
    setUsername(enteredUsername);
    setCurrentView('chat');
  };

  return (
    <Switch>
      <Route path="/">
        {currentView === 'landing' ? (
          <LandingPage onEnterChat={handleEnterChat} />
        ) : (
          <ChatRoom username={username} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <IsegoriaPlatform />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
