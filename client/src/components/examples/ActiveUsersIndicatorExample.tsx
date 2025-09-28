import ActiveUsersIndicator from '../ActiveUsersIndicator';

export default function ActiveUsersIndicatorExample() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="space-y-8 text-center">
        <h2 className="text-2xl font-bold">Active Users Indicator Examples</h2>
        <div className="space-y-4">
          <ActiveUsersIndicator count={1} />
          <ActiveUsersIndicator count={15} />
          <ActiveUsersIndicator count={142} />
        </div>
      </div>
    </div>
  );
}