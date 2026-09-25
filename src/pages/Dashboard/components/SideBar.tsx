import {
  ArrowLeft,
  ArrowRight,
  ChartSplineIcon,
  NotepadText,
  LibrarySquare,
  Globe,
  Folder,
  LayoutGrid,
} from "lucide-react";
import { RiCalendarEventFill, RiSettingsLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Avatar } from "antd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { useCurrentUser } from "../DashboardHome/hooks/Usecurrentuser";
import { useTheme } from "../../../context/theme";

const NAV_ITEMS = [
  { icon: LayoutGrid, text: "Overview", path: "/" },
  { icon: NotepadText, text: "Notes", path: "/notes" },
  { icon: LibrarySquare, text: "Library", path: "/library" },
  { icon: ChartSplineIcon, text: "Analytics", path: "/analytics" },
  { icon: Folder, text: "Projects", path: "/projects" },
  { icon: RiCalendarEventFill, text: "Events", path: "/events" },
  { icon: Globe, text: "Community", path: "/community" },
];

const sidebarVariants: Variants = {
  open: { width: "17rem", transition: { duration: 0.35, ease: [0.42, 0, 0.58, 1] } },
  collapsed: { width: "5.25rem", transition: { duration: 0.35, ease: [0.42, 0, 0.58, 1] } },
};

const LeaflineSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const user = useCurrentUser();
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const isActive = (path: string) => currentPath === `/dashboard${path}`;
  const toggleSidebar = () => setCollapsed((c) => !c);

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "open"}
        className="bg-white dark:bg-[#080808] text-[#171223] dark:text-white h-full
        border-r border-neutral-200 dark:border-[#2e2b30]
        p-4 flex flex-col"
      >
        {/* ===== Wordmark + collapse toggle ===== */}
        <div className={`flex items-center mb-8 ${collapsed ? "justify-center" : "justify-between"}`}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xl font-semibold tracking-tight text-[#4b0082] dark:text-[#9d4edd]">
                  Leafline
                </p>
                <p className="text-xs text-neutral-400">Academic Workspace</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  aria-expanded={!collapsed}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className="w-8 h-8 flex items-center justify-center cursor-pointer text-neutral-500
                  hover:bg-neutral-100 dark:hover:bg-[#262525] rounded-full transition"
                >
                  {collapsed ? (
                    <ArrowRight className="w-4 h-4" />
                  ) : (
                    <ArrowLeft className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-medium">
                {collapsed ? "Expand" : "Collapse"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ===== Navigation ===== */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              text={item.text}
              path={item.path}
              active={isActive(item.path)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* ===== Settings + user footer ===== */}
        <div className="mt-auto pt-3 border-t border-neutral-200 dark:border-[#2e2b30] flex flex-col gap-1.5">
          <SidebarItem
            icon={RiSettingsLine}
            text="Settings"
            path="/settings"
            active={isActive("/settings")}
            collapsed={collapsed}
          />

          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-3 rounded-xl p-2 mt-2 transition hover:bg-neutral-100 dark:hover:bg-[#262525]
            ${collapsed ? "justify-center" : ""}`}
          >
            {user.pictureUrl ? (
              <Avatar src={user.pictureUrl} size={36} />
            ) : (
              <Avatar size={36} style={{ backgroundColor: isDark ? "#9d4edd" : "#4b0082" }}>
                {user.initials}
              </Avatar>
            )}
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0"
                >
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-neutral-400 truncate">
                    {user.email || "Loading…"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

const SidebarItem = ({
  icon: Icon,
  text,
  path,
  active = false,
  collapsed = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
}) => {
  const item = (
    <motion.div
      whileHover={{ x: collapsed ? 0 : 2 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center ${collapsed ? "justify-center" : ""} px-3 py-2.5 rounded-xl transition-colors text-[14.5px] font-medium
      ${
        active
          ? "bg-violet-100 text-[#150e2b] dark:bg-[#9d4edd] dark:text-white"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-[#262525] dark:hover:text-white"
      }`}
    >
      <Icon className={`w-[18px] h-[18px] ${collapsed ? "" : "mr-3"}`} />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <Link to={`/dashboard${path}`}>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{item}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-medium">
            {text}
          </TooltipContent>
        </Tooltip>
      ) : (
        item
      )}
    </Link>
  );
};

export default LeaflineSidebar;