import { useEffect, useState } from "react";
import { Avatar, Badge } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Bell, HelpCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import SearchBar from "../../../components/search/search";
import LogoutButton from "../../../features/auth/logout/logout";
import { getNotifications } from "../notifications/api/api";
import type { NotificationResponse } from "../notifications/interface/notificationTypes";
import { useCurrentUser } from "../DashboardHome/hooks/Usecurrentuser";

const Navbar = () => {
  const user = useCurrentUser();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-3 px-4 sm:px-7 flex items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800">
      {/* Search pill */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 w-full max-w-sm rounded-full border border-neutral-200 dark:border-neutral-800
        bg-neutral-50 dark:bg-[#111] px-4 py-2 text-sm text-neutral-400 hover:border-neutral-300 transition text-left"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="truncate">Search notes, projects, or events…</span>
      </button>
      {/* Reuses the existing search modal; the pill above is its trigger */}
      {searchOpen && (
        // @ts-expect-error - SearchBar props typing mismatch; runtime props are correct
        <SearchBar open={searchOpen} onOpenChange={setSearchOpen} />
      )}


      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Notifications */}
        <Link to="notifications">
          <Badge count={notifications.length} size="small">
            <span className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-[#4b0082] hover:border-violet-200 transition">
              <Bell className="w-[18px] h-[18px]" />
            </span>
          </Badge>
        </Link>

        {/* Help */}
        <span className="w-9 h-9 hidden sm:flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-[#4b0082] hover:border-violet-200 transition cursor-pointer">
          <HelpCircle className="w-[18px] h-[18px]" />
        </span>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user.pictureUrl ? (
              <Avatar src={user.pictureUrl} size="default" style={{ cursor: "pointer" }} />
            ) : (
              <Avatar style={{ backgroundColor: "#4b0082", cursor: "pointer" }} size="default">
                {user.initials}
              </Avatar>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-md dark:bg-[#252525] dark:text-white shadow-lg cursor-pointer bg-white text-black dark:border-none"
            align="end"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700">
              <div className="text-sm">
                <p className="font-semibold text-black dark:text-white">{user.name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</p>
              </div>
            </div>

            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-50 cursor-pointer">
              <UserOutlined />
              <span>Profile</span>
            </DropdownMenuItem>

            <Link to="settings">
              <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-50 cursor-pointer">
                <SettingOutlined />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-50 cursor-pointer">
              <PlusOutlined />
              <span>New Workspace</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-700" />

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem className="p-0">
                <LogoutButton />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;