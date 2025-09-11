// src/pages/Dashboard/components/DashboardLayout.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import LeaflineSidebar from "./SideBar";
import { RiMenu2Line } from "react-icons/ri";

const DashboardLayout = () => {
  const [userName, setUserName] = useState("User");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("leafline_user") || "{}");
    setUserName(user?.name || "User");
  }, []);

  return (
    <div className="h-screen flex overflow-hidden font-sans bg-[#101012]">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block ">
        <LeaflineSidebar />
      </div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <motion.div
              className="fixed top-0 left-0 h-full w-64 md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside sidebar
            >
              <LeaflineSidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col shadow-2xl">
        {/* Top Navbar */}
        <div className="flex items-center px-5 py-2 d">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden text-blue-600 !text-2xl"
          >
            <RiMenu2Line className="text-gray-100" />
          </button>
          <Navbar userName={userName} />
        </div>

        {/* Routed Page Content */}
        <main className="py-4 px-20 flex-1  overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
