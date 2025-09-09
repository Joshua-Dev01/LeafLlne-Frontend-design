// src/components/Navbar.tsx
import { Avatar, Badge,  } from "antd";
import { BellOutlined,  SettingOutlined } from "@ant-design/icons";
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
    <div className="w-full right-0 py-2 px-7 bg-white flex items-center  justify-between">
      {/* Search */}

      <div className="">
       <SearchBar />

      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <Badge count={3} size="small">
          <BellOutlined className="text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />
        </Badge>

        {/* Settings */}
        <SettingOutlined className="text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <Avatar
            style={{
              backgroundColor: "#3b82f6",
              verticalAlign: "middle",
            }}
            size="default"
          >
            {initials}
          </Avatar>
          <span className="font-medium text-gray-700">{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
