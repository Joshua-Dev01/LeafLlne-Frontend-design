// src/pages/Dashboard/components/MobileTopBar.tsx
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
// import { Avatar } from "antd";

import logo from "../../../assets/logo.png";
// import { useCurrentUser } from "../DashboardHome/hooks/Usecurrentuser";
// import { useTheme } from "../../../context/theme";

type Props = {
  onMenuClick: () => void;
};

const MobileTopBar = ({ onMenuClick }: Props) => {
//   const user = useCurrentUser();
//   const { theme } = useTheme();
//   const isDark =
//     theme === "dark" ||
//     (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div
      className="md:hidden flex items-center justify-between px-4 py-2.5
      bg-white dark:bg-[#080808] border-b border-neutral-200 dark:border-[#2e2b30]"
    >
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[#4b0082] dark:bg-[#9d4edd]">
          <img src={logo} alt="Leafline logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-[#4b0082] dark:text-[#9d4edd]">
          Leafline
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="w-9 h-9 flex items-center justify-center rounded-full
          text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#262525] transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* <Link to="/dashboard/settings">
          {user.pictureUrl ? (
            <Avatar src={user.pictureUrl} size={32} />
          ) : (
            <Avatar size={32} style={{ backgroundColor: isDark ? "#9d4edd" : "#4b0082" }}>
              {user.initials}
            </Avatar>
          )}
        </Link> */}
      </div>
    </div>
  );
};

export default MobileTopBar;