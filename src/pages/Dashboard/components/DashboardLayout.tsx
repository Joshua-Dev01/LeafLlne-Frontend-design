// src/pages/Dashboard/components/DashboardLayout.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import LeaflineSidebar from "./SideBar";
// import { RiMenu2Line } from "react-icons/ri";
import { ThemeProvider } from "../../../context/theme";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden font-sans bg-app-bg dark:bg-[#000000] ">
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
        <div className="flex items-center  py-2 ">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden text-blue-600 !text-2xl px-5"
          >
            <Menu className="text-black cursor-pointer dark:text-white   w-6 h-6" />
          </button>
          <Navbar />
        </div>

        {/* Routed Page Content */}
        <main className="py-4 px-10 flex-1  overflow-auto">
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;