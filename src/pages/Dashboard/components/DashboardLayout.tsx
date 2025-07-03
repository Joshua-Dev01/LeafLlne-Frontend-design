import { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Navbar from "./NavBar";


const DashboardLayout = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("leafline_user") || "{}");
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <Navbar userName={userName} />
        <main className="p-4 overflow-auto bg-gray-50 flex-1">
          <h2 className="text-xl font-bold mb-4">Welcome, {userName} 👋</h2>
          <p className="text-gray-700 text-sm">
            This is your dashboard page content, personalized for you.
          </p>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
