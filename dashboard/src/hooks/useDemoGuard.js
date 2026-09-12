import { useAuth } from '@/lib/auth-context';

// Provides helper methods to detect demo client sessions and guard restricted administrative actions
export const useDemoGuard = () => {
  const { user } = useAuth();
  const isDemoClient = user?.role === 'Demo Client';

  // Triggers the global purchase modal with an optional feature description
  const showPurchaseModal = (feature = 'You have to purchase this system to use it.') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-demo-purchase-modal', {
          detail: { feature },
        }),
      );
    }
  };

  // Intercepts action execution for demo users and displays purchase prompt
  const guardAction = (actionFn, featureMessage) => {
    if (isDemoClient) {
      showPurchaseModal(featureMessage);
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
