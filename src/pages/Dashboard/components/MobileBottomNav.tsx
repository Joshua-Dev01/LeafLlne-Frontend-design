// src/pages/Dashboard/components/MobileBottomNav.tsx
import { useState } from "react";
import { LayoutGrid, Search, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import SearchBar from "../../../components/search/search";
import { useNotificationSummary } from "../notifications/hooks/useNotifications";

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: notificationSummary } = useNotificationSummary();

  const isActive = (path: string) =>
    path === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(path);

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30
        bg-white dark:bg-[#080808] border-t border-neutral-200 dark:border-[#2e2b30]
        pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-stretch justify-around">
          <NavTab
            icon={LayoutGrid}
            label="Overview"
            to="/dashboard"
            active={isActive("/dashboard") && !pathname.startsWith("/dashboard/")}
          />
          <NavTabButton icon={Search} label="Search" onClick={() => setSearchOpen(true)} />
          <NavTab
            icon={Bell}
            label="Alerts"
            to="/dashboard/notifications"
            active={isActive("/dashboard/notifications")}
            badge={(notificationSummary?.unread ?? 0) > 0}
          />
          <NavTab
            icon={User}
            label="Profile"
            to="/dashboard/settings"
            active={isActive("/dashboard/settings")}
          />
        </div>
      </nav>

      {searchOpen && <SearchBar open={searchOpen} onOpenChange={setSearchOpen} />}
    </>
  );
};

const NavTab = ({
  icon: Icon,
  label,
  to,
  active,
  badge,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  to: string;
  active: boolean;
  badge?: boolean;
}) => (
  <Link
    to={to}
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition
    ${active ? "text-[#4b0082] dark:text-[#9d4edd]" : "text-neutral-400 dark:text-neutral-500"}`}
  >
    <span className="relative">
      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#080808]" />
      )}
    </span>
    {label}
  </Link>
);

const NavTabButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium
    text-neutral-400 dark:text-neutral-500 transition"
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export default MobileBottomNav;