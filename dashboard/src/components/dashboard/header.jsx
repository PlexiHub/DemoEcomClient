import { Input } from '@/components/ui/input';
import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationBell } from './NotificationBell';
import { useDashboardStore } from '@/store/use-dashboard-store';
import { useSidebar } from '@/components/ui/sidebar';

// Header component for dashboard pages
export const Header = () => {
  const { searchQuery, setSearchQuery } = useDashboardStore();
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <button 
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground" 
          onClick={() => isMobile ? setOpenMobile(true) : toggleSidebar()}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        <form className="ml-auto flex-1 sm:flex-initial" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full sm:w-[200px] md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};
