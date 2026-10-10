// src/pages/Dashboard/components/DashboardLayout.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import LeaflineSidebar from "./SideBar";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav from "./MobileBottomNav";

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
      <div className="flex-1 flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar — compact logo/menu/avatar bar on mobile, full search navbar on desktop */}
        <MobileTopBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <div className="hidden md:flex items-center py-2">
          <Navbar />
        </div>

        {/* Routed Page Content */}
        <main className="py-4 px-4 md:px-10 flex-1 overflow-auto pb-20 md:pb-4">
          <Outlet />
        </main>

        {/* Bottom tab bar on mobile */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;