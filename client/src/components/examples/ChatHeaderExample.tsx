import ChatHeader from '../ChatHeader';

export default function ChatHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <ChatHeader activeUsers={42} />
      <div className="p-6">
        <p className="text-muted-foreground text-center">
          Chat header component with platform name and active user count
        </p>
      </div>
    </div>
  );
}