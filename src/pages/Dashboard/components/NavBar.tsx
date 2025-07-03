import { UserOutlined } from "@ant-design/icons";

type Props = {
  userName: string;
};

const Navbar = ({ userName }: Props) => {
  return (
    <div className="w-full px-4 py-3 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-xl font-semibold text-green-700">📖 LeafLine Dashboard</h1>
      <div className="flex items-center space-x-2">
        <UserOutlined />
        <span className="font-medium text-gray-700">{userName}</span>
      </div>
    </div>
  );
};

export default Navbar;
