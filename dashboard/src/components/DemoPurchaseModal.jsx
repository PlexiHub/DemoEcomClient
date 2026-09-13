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
import { AlertCircle, MessageCircle, ExternalLink } from 'lucide-react';

// Renders alert dialog for demo account restrictions with WhatsApp contact action
export const DemoPurchaseModal = () => {
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('This is a Demo Account!!');
  const [modalMessage, setModalMessage] = useState('You have to be a system/business "Owner" to view and manage this page');
  const [btnText, setBtnText] = useState('Contact Us');

  useEffect(() => {
    const handleTrigger = (e) => {
      const detail = e?.detail || {};
      const title = detail.title || 'This is a Demo Account!!';
      const msg = detail.message || detail.feature || 'You have to be a system/business "Owner" to view and manage this page';
      const contactLabel = detail.buttonText || 'Contact Us';
      setModalTitle(title);
      setModalMessage(msg);
      setBtnText(contactLabel);
      setOpen(true);
    };

    window.addEventListener('show-demo-purchase-modal', handleTrigger);
    return () => {
      window.removeEventListener('show-demo-purchase-modal', handleTrigger);
    };
  }, []);

  // Opens WhatsApp chat link with the contact phone number
  const handleContactClick = () => {
    const defaultText = encodeURIComponent(
      'Hello Plexivia team, I am using the Demo Account and would like to upgrade to system Owner.',
    );
    window.open(`https://wa.me/8801823110885?text=${defaultText}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[460px] border-border bg-card text-card-foreground shadow-2xl rounded-2xl p-6">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <AlertCircle className="h-7 w-7" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {modalMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-xs border-border cursor-pointer"
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleContactClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{btnText}</span>
            <ExternalLink className="h-3 w-3 opacity-80" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemoPurchaseModal;
