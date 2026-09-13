import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

// Guards sensitive dashboard views from demo clients by showing restriction alert and lock view
export const DemoRestrictedGuard = ({ children, pageTitle = 'This Page' }) => {
  const { user } = useAuth();
  const normalizedRole = String(user?.role || '').toLowerCase().trim();
  const isDemoClient = normalizedRole === 'demo client' || normalizedRole.includes('demo');

  useEffect(() => {
    if (isDemoClient && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-demo-purchase-modal', {
          detail: {
            title: 'Purchase Required!',
            message: 'এই ফিচারটি দেখতে ও ব্যবহার করতে প্যাকেজ পারচেজ করা লাগবে। বিস্তারিত জানতে এডমিনের সাথে যোগাযোগ করুন।',
            buttonText: 'Contact Admin',
            whatsappText: `Hello Plexivia team, I want to purchase and activate the ${pageTitle} feature for my store.`,
          },
        }),
      );
    }
  }, [isDemoClient, pageTitle]);

  // Opens WhatsApp link for immediate inquiries
  const handleContactClick = () => {
    const defaultText = encodeURIComponent(
      `Hello Plexivia team, I want to purchase and activate the ${pageTitle} feature for my store.`,
    );
    window.open(`https://wa.me/8801823110885?text=${defaultText}`, '_blank', 'noopener,noreferrer');
  };

  if (isDemoClient) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-[70vh]">
        <div className="max-w-md w-full bg-card border border-border/80 shadow-xl rounded-2xl p-8 text-center space-y-5">
          <div className="mx-auto h-16 w-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Purchase Required!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              এই ফিচারটি দেখতে ও ব্যবহার করতে প্যাকেজ পারচেজ করা লাগবে। বিস্তারিত জানতে এডমিনের সাথে যোগাযোগ করুন।
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground">
            This feature requires a premium package purchase. Please contact the system administrator to activate.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="w-full sm:w-auto text-xs border-border cursor-pointer"
            >
              <Link to="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Overview</span>
              </Link>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleContactClick}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact Admin</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default DemoRestrictedGuard;
