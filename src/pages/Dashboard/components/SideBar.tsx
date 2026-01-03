import {
  ArrowLeft,
  ArrowRight,
  ChartSplineIcon,
  NotepadText,
  LibrarySquare,
  Globe,
  Folder,
} from "lucide-react";
import {
  RiCalendarEventFill,
  RiSettingsLine,
  RiTableView,
} from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import logo from "../../../assets/logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

const LeaflineSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => currentPath === `/dashboard${path}`;
  const toggleSidebar = () => setCollapsed(!collapsed);

  const sidebarVariants: Variants = {
    open: {
      width: "17rem",
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
    },
    collapsed: {
      width: "5rem",
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "open"}
        className={`dark:bg-[#090909] bg-white text-black dark:text-white h-full 
        border-r border-neutral-200 dark:border-neutral-800 
        p-3 flex flex-col justify-between `}
      >
        {/* ===== Top Section ===== */}
        <div className="text-[13px]">
          <div className="flex items-center justify-between mb-7">
            <motion.img
              src={logo}
              alt="Leafline Logo"
              className="w-14 h-14 rounded-full shadow-md"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div whileTap={{ rotate: 10 }}>
              {/* Toggle button: shows left arrow when expanded, right arrow when collapsed */}
              <div className="hidden md:flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleSidebar}
                      aria-expanded={!collapsed}
                      aria-label={
                        collapsed ? "Expand sidebar" : "Collapse sidebar"
                      }
                      className="w-9 h-9 flex items-center justify-center cursor-pointer dark:text-[#737479] p-1 rounded-full shadow-lg  dark:bg-[#1b1b1b] transition"
                    >
                      {collapsed ? (
                        <ArrowRight className="w-5 h-5" />
                      ) : (
                        <ArrowLeft className="w-5 h-5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs font-medium">
                    {collapsed ? "Expand" : "Collapse"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          </div>

          {/* ===== Navigation ===== */}
          <nav className="flex flex-col gap-3 mt-3">
            <SidebarItem
              icon={RiTableView}
              text="Overview"
              path="/"
              active={isActive("/")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={NotepadText}
              text="Notes"
              path="/notes"
              active={isActive("/notes")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={LibrarySquare}
              text="Library"
              path="/library"
              active={isActive("/library")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={ChartSplineIcon}
              text="Analytics"
              path="/analytics"
              active={isActive("/analytics")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={Folder}
              text="Projects"
              path="/projects"
              active={isActive("/projects")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={RiCalendarEventFill}
              text="Events"
              path="/events"
              active={isActive("/events")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={Globe}
              text="Community"
              path="/community"
              active={isActive("/community")}
              collapsed={collapsed}
            />
          </nav>
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="mt-auto pt-4 border-t border-neutral-300 dark:border-neutral-800">
          <SidebarItem
            icon={RiSettingsLine}
            text="Settings"
            path="/settings"
            active={isActive("/settings")}
            collapsed={collapsed}
          />
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

// Sidebar Item Component
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
      whileHover={{ scale: 1.04, x: collapsed ? 0 : 4 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center ${collapsed ? 'justify-center' : ''} p-3 rounded-xl transition-all group cursor-pointer text-[17px]
      ${
        active
          ? "bg-gradient-to-r from-[#1e293b] to-[#0f172a] !text-white shadow-md "
          : " hover:bg-gradient-to-r hover:from-[#1e293b] hover:text-white hover:to-[#0f172a] "
      }`}
    >
      <Icon
        className={`transition ${
          collapsed ? "w-5 h-5" : "w-5 h-5 mr-2"
        } ${active ? "text-white" : "text-gray-600 dark:text-gray-400"} group-hover:text-white`}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
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
