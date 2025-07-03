import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-full bg-white shadow-md w-full">
      <div className="p-4">
        <h2 className="text-xl font-bold text-green-700">🌿 LeafLine</h2>
      </div>

      <Menu
        mode="inline"
        items={[
          {
            key: "1",
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to="/profile">Profile</Link>,
          },
          {
            key: "3",
            icon: <SettingOutlined />,
            label: <Link to="/settings">Settings</Link>,
          },
        ]}
      />
    </div>
  );
};

export default Sidebar;
