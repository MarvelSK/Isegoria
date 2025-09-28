import ActiveUsersIndicator from './ActiveUsersIndicator';

interface ChatHeaderProps {
  activeUsers: number;
}

export default function ChatHeader({ activeUsers }: ChatHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-foreground" data-testid="text-platform-name">
        Isegoria
      </h1>
      
      <ActiveUsersIndicator count={activeUsers} />
    </header>
  );
}