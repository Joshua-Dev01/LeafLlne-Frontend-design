import {
  Settings,
  LogOut,
  BookOpen,
  BarChart2,
  FolderKanban,
  ChevronDown,
  Home,
  User,
  Library,
  Headphones,
  PanelLeftOpen, 
  NotebookIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const LeaflineSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false); // 🔥 Sidebar collapse state

  const isActive = (path: string) => currentPath === `/dashboard${path}`;
  const isMenuActive = (items: Array<{ path: string }>) =>
    items.some(item => currentPath === `/dashboard${item.path}`);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const toggleSidebar = () => setCollapsed(!collapsed); // 🔁 toggle collapse

  const dropdownMenus = {
    library: {
      label: "Library",
      icon: Library,
      items: [
        { label: "My Books", icon: BookOpen, path: "/library/my-books" },
        { label: "Audiobooks", icon: Headphones, path: "/library/audios" },
      ],
    },
   
  };

  const settingsMenu = {
    label: "Settings",
    icon: Settings,
    items: [
      { label: "Account Settings", icon: Settings, path: "/settings/account" },
      { label: "Profile", icon: User, path: "/settings/profile" },
    ],
  };

  return (
    <aside
      className={`bg-[#090909] text-white h-full p-2 shadow-md transition-all duration-300 ${collapsed ? "w-20" : "w-60"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-4">
       
        <button
          className="text-white hover:text-green-500 transition"
          onClick={toggleSidebar}
        >
          <PanelLeftOpen  className="w-5 h-5  cursor-pointer " />
        </button>
      </div>

      <nav className="space-y-2 mt-4">
        <SidebarItem
          icon={Home}
          text="Home"
          path="/"
          active={isActive("/")}
          collapsed={collapsed}
        />

       
       

        {/* Dropdowns */}
        {Object.entries(dropdownMenus).map(([menuId, menu]) => {
          const isParentActive = isMenuActive(menu.items);
          return (
            <div key={menuId}>
              <button
                onClick={() => toggleMenu(menuId)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isParentActive ? "bg-white !text-black" : "hover:bg-gray-100 hover:!text-black"
                  }`}
              >
                <div className="flex items-center">
                  <menu.icon className="w-5 h-5 mr-2" />
                  {!collapsed && <span>{menu.label}</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openMenus.includes(menuId) ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>

              {openMenus.includes(menuId) && !collapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  {menu.items.map((item, index) => (
                    <Link
                      key={index}
                      to={`/dashboard${item.path}`}
                      className={`flex items-center p-2 rounded-lg text-sm transition-colors ${isActive(item.path)
                          ? "bg-white text-black"
                          : "hover:bg-gray-100 hover:text-black"
                        }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Static */}

          <SidebarItem
          icon={NotebookIcon}
          text="Notes"
          path="/notes"
          active={isActive("/notes")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={BarChart2}
          text="Analytics"
          path="/analytics"
          active={isActive("/analytics")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={FolderKanban}
          text="Projects"
          path="/projects"
          active={isActive("/projects")}
          collapsed={collapsed}
        />
       

        {/* Settings */}
        <div>
          <button
            onClick={() => toggleMenu("settings")}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isMenuActive(settingsMenu.items)
                ? "bg-white !text-black"
                : "hover:bg-gray-100 hover:!text-black"
              }`}
          >
            <div className="flex items-center">
              <settingsMenu.icon className="w-5 h-5 mr-2" />
              {!collapsed && <span>{settingsMenu.label}</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openMenus.includes("settings") ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>

          {openMenus.includes("settings") && !collapsed && (
            <div className="ml-6 mt-2 space-y-1">
              {settingsMenu.items.map((item, index) => (
                <Link
                  key={index}
                  to={`/dashboard${item.path}`}
                  className={`flex items-center p-2 rounded-lg text-sm transition-colors ${isActive(item.path)
                      ? "bg-white text-black"
                      : "hover:bg-gray-100 hover:text-black"
                    }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <SidebarItem
          icon={LogOut}
          text="Logout"
          path="/logout"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
};

// SidebarItem supports collapsed prop now
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
}) => (
  <Link
    to={`/dashboard${path}`}
    className={`flex items-center p-3 rounded-lg transition-colors ${active ? "bg-white text-black" : "hover:bg-gray-100 hover:text-black"
      }`}
  >
    <Icon className="w-5 h-5 mr-2" />
    {!collapsed && <span>{text}</span>}
  </Link>
);

export default LeaflineSidebar;
