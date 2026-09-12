import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Header } from '@/components/dashboard/header';
import { ClientSidebarProvider } from '@/components/dashboard/client-sidebar-provider';
import { AuthGuard } from '@/components/auth-guard';
import { ClientThemeProvider } from '@/components/clientThemeProvider';
import { ClientRouteGuard } from '@/components/clientRouteGuard';
import { DemoPurchaseModal } from '@/components/DemoPurchaseModal';

// Root layout for dashboard shell with client theme, sidebar, and demo purchase modal
const DashboardLayout = ({ children }) => {
  return (
    <AuthGuard>
      <ClientThemeProvider>
        <ClientSidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-muted/20">
              <ClientRouteGuard>
                {children || <Outlet />}
              </ClientRouteGuard>
            </main>
          </div>
          <DemoPurchaseModal />
        </ClientSidebarProvider>
      </ClientThemeProvider>
    </AuthGuard>
  );
};

export default DashboardLayout;
