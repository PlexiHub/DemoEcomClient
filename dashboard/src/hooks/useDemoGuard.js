import { useAuth } from '@/lib/auth-context';

// Provides helper methods to detect demo client sessions and guard restricted administrative actions
export const useDemoGuard = () => {
  const { user } = useAuth();
  const normalizedRole = String(user?.role || '').toLowerCase().trim();
  const isDemoClient = normalizedRole === 'demo client' || normalizedRole.includes('demo');

  // Triggers the global demo restriction alert dialog
  const showPurchaseModal = (customTitle, customMessage) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-demo-purchase-modal', {
          detail: {
            title: customTitle || 'Purchase Required!',
            message: customMessage || 'এই ফিচারটি দেখতে ও ব্যবহার করতে প্যাকেজ পারচেজ করা লাগবে। বিস্তারিত জানতে এডমিনের সাথে যোগাযোগ করুন।',
            buttonText: 'Contact Admin',
          },
        }),
      );
    }
  };

  // Intercepts action execution for demo users and displays purchase prompt
  const guardAction = (actionFn, customTitle, customMessage) => {
    if (isDemoClient) {
      showPurchaseModal(customTitle, customMessage);
      return false;
    }
    if (typeof actionFn === 'function') {
      return actionFn();
    }
    return true;
  };

  return {
    isDemoClient,
    guardAction,
    showPurchaseModal,
  };
};

export default useDemoGuard;
