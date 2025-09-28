import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TOSModal({ isOpen, onClose }: TOSModalProps) {
  const handleClose = () => {
    console.log('TOS modal closed');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-card border border-card-border rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground text-center" data-testid="title-tos">
            Terms of Service
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-foreground leading-relaxed" data-testid="content-tos">
          <p>
            Isegoria is an anonymous platform where users can post freely. Content may include opinions, 
            language, or material that could be offensive or sensitive.
          </p>
          
          <p>
            By entering, you acknowledge that all posts are the responsibility of their authors. 
            Respect others and use responsibly.
          </p>
          
          <div className="pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              By using this platform, you agree to these terms and understand the nature of anonymous communication.
            </p>
          </div>
        </div>
        
        <div className="pt-6">
          <Button 
            onClick={handleClose}
            className="w-full py-3 rounded-xl hover-elevate"
            data-testid="button-close-tos"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}