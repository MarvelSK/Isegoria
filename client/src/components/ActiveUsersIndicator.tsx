import { Users } from 'lucide-react';

interface ActiveUsersIndicatorProps {
  count: number;
}

export default function ActiveUsersIndicator({ count }: ActiveUsersIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground" data-testid="indicator-active-users">
      <Users className="w-5 h-5" />
      <span className="text-sm font-medium" data-testid="text-user-count">
        {count} active
      </span>
    </div>
  );
}