// src/components/Navbar.tsx
import { Avatar, Badge } from "antd";
import {
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"; // shadcn
import SearchBar from "../../../components/search/search";

type Props = {
  userName: string;
};

const Navbar = ({ userName }: Props) => {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="w-full py-2 px-4 sm:px-7 flex items-center justify-between border-gray-200">
      <div></div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <SearchBar />

        {/* Notification */}
        <Badge count={3} size="small">
          <BellOutlined className="text-lg !text-gray-300 hover:text-blue-500 cursor-pointer" />
        </Badge>

        {/* More */}

        {/* Avatar with ShadCN dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              style={{
                backgroundColor: "#252520",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              size="default"
            >
              {initials}
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-md border border-gray-700 bg-[#252525] text-white shadow-lg"
            align="end"
          >
            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-">
              <UserOutlined />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-">
              <SettingOutlined />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-">
              <PlusOutlined />
              <span>New Workspace</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-700 focus:text-gray-50" />

            <DropdownMenuItem className="flex items-center gap-2 text-red-400 focus:bg-gray-700 focus:text-red-400">
              <LogoutOutlined />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
