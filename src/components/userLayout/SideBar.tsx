import { Database, Users, ShoppingBag, FolderKanban, Users2, FileSpreadsheet, ChevronDown, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const DashboardSidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    // Helper function to check if the current path matches a specific route
    const isActive = (path: string) => currentPath === `/app${path}`;

   

    // Toggle dropdown menu
    const toggleMenu = (menuId: string) => {
        setOpenMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    // Menu configurations
    const dropdownMenus = {
        hrm: {
            label: "HRM",
            icon: Users,
          
        },
        stock: {
            label: "STOCK MGT",
            icon: ShoppingBag,
           
        }
    };


  

    return (
        <aside className="w-52 p-2 mb-2 flex-shrink-0 bg-whitez border-r overflow-y-auto">
            <nav className="space-y-2">
                <Link
                    to="/app"
                    className={`flex items-center p-3 rounded-lg transition-colors ${isActive('') ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                        }`}
                >
                    <Database className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                </Link>

                <SidebarItem icon={User} text="User MGT" path="/user-mgt" active={isActive('/user-mgt')} />

                {/* Dropdown Menus */}
                {Object.entries(dropdownMenus).map(([menuId, menu]) => {
                    return (
                        <div key={menuId}>
                            <button
                                onClick={() => toggleMenu(menuId)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors  ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <menu.icon className="w-5 h-5 mr-3" />
                                    <span>{menu.label}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${openMenus.includes(menuId) ? 'rotate-180' : ''
                                    }`} />
                            </button>

                            {/* Dropdown Items */}
                            {openMenus.includes(menuId) && (
                                <div className="ml-4 mt-2 space-y-1">
                                   
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Regular menu items */}
                <SidebarItem icon={FolderKanban} text="PROJECT MGT" path="/project-mgt" active={isActive('/project-mgt')} />
                <SidebarItem icon={Users2} text="CRM" path="/crm" active={isActive('/crm')} />
                <SidebarItem icon={FileSpreadsheet} text="ACCOUNTING" path="/accounting" active={isActive('/accounting')} />

                <div className="pt-24 space-y-1">
                    {/* <SidebarItem icon={Settings} text="Settings" path="/settings"  active={isActive('/settings')} /> */}
                    {/* Settings Dropdown */}
                    <div>


                        {/* Settings Dropdown Items */}
                        {openMenus.includes('settings') && (
                            <div className="ml-4 mt-2 space-y-1">
                             
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </aside>
    );
};

type SideBarProps = {
    text: string;
    icon: any;
    path?: string | null;
    active?: boolean;
    onClick?: () => void;
};

const SidebarItem = ({ icon: Icon, text, path, active = false, onClick }: SideBarProps) => (
    <Link
        to={path ? `/app${path}` : '#'}
        onClick={onClick}
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
            }`}
    >
        <Icon className="w-5 h-5 mr-3" />
        <span>{text}</span>
    </Link>
);

export default DashboardSidebar;