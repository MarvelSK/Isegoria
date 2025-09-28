import ImageMessage from '../ImageMessage';

export default function ImageMessageExample() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Image Message Examples</h2>
        
        <div className="space-y-4">
          <div className="bg-self-message p-4 rounded-2xl">
            <div className="text-sm font-medium text-self-message-foreground mb-2">
              Your Image
            </div>
            <ImageMessage 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
              alt="Sunset landscape"
            />
          </div>
          
          <div className="bg-other-message p-4 rounded-2xl">
            <div className="text-sm font-medium text-other-message-foreground mb-2">
              Someone's Image
            </div>
            <ImageMessage 
              src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop"
              alt="Ocean waves"
            />
          </div>
        </div>
      </div>
    </div>
  );
}