import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';

// Renders an informational purchase notice dialog when demo clients trigger restricted features
export const DemoPurchaseModal = () => {
  const [open, setOpen] = useState(false);
  const [featureName, setFeatureName] = useState('');

  useEffect(() => {
    const handleTrigger = (e) => {
      const customMsg = e?.detail?.feature || e?.detail?.message || '';
      setFeatureName(customMsg);
      setOpen(true);
    };

    window.addEventListener('show-demo-purchase-modal', handleTrigger);
    return () => {
      window.removeEventListener('show-demo-purchase-modal', handleTrigger);
    };
  }, []);

  // Opens WhatsApp link for production system inquiries
  const handlePurchaseClick = () => {
    const message = encodeURIComponent(
      'Hello Plexivia team, I am testing the demo store and would like to purchase the complete system.',
    );
    window.open(`https://wa.me/8801823110885?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[460px] border-border bg-card text-card-foreground shadow-2xl rounded-2xl p-6">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
            Feature Restricted in Demo
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {featureName || 'You have to purchase this system to use it.'}
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span>Full System Capabilities</span>
          </div>
          <p className="text-muted-foreground leading-relaxed text-[11px]">
            In the demo version, you can explore product management, test orders, and brand customization. Advanced administrative tools, payment gateways, and system configurations are unlocked upon full system purchase.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-xs border-border"
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handlePurchaseClick}
            className="bg-primary hover:bg-primary/90 text-black font-semibold text-xs flex items-center gap-1.5 shadow"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Purchase System</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemoPurchaseModal;
