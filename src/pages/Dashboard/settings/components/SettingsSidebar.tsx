import { useState } from "react";
import {
  SettingOutlined,
  BellOutlined,
  LinkOutlined,
  TeamOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

type Props = {
  userName: string; // full name from API
};

const SettingsSidebar = ({ userName }: Props) => {
  const [active, setActive] = useState("Preferences");

  const menuItems = [
    { name: "Preferences", icon: <SettingOutlined /> },
    { name: "Notifications", icon: <BellOutlined /> },
    { name: "Connections", icon: <LinkOutlined /> },
  ];

  const workspaceItems = [
    { name: "General", icon: <GlobalOutlined /> },
    { name: "People", icon: <TeamOutlined /> },
    { name: "Teamspaces", icon: <TeamOutlined /> },
  ];

  return (
    <div className="fixed  w-64  text-black dark:text-gray-200 flex flex-col p-4  dark:bg-[#000000] ">
      {/* Account Section */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wide  font-semibold">
          Account
        </h3>
        <p className="font-semibold uppercase mt-1 text-[15px] truncate">
          {userName || "Loading..."}
        </p>
      </div>

      {/* Scrollable Menu Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Preferences */}
        <div className="space-y-1 mb-6">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all ${
                active === item.name
                  ? "bg-gray-700/40 "
                  : "hover:bg-gray-700/30 "
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div>
          <h3 className="text-xs uppercase tracking-wide font-medium">
            Workspace
          </h3>
          <div className="mt-2 space-y-1">
            {workspaceItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700/30 cursor-pointer text-sm"
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default SettingsSidebar;
