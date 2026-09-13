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
            title: customTitle || 'This is a Demo Account!!',
            message: customMessage || 'You have to be a system/business "Owner" to view and manage this page',
            buttonText: 'Contact Us',
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
