import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu2Line } from "react-icons/ri";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  // 🟡 Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full left-0 flex justify-between items-center px-6 md:px-20 py-4 fixed top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div className="text-3xl font-bold text-[#04023a]">
          📚 <span className="text-[18px] font-mono">LeafLine</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-10 text-sm font-bold text-gray-700">
          <li><Link to="#">About</Link></li>
          <li><Link to="#">Company</Link></li>
          <li><Link to="#">Pricing</Link></li>
          <li><Link to="#">Help</Link></li>
        </ul>

        {/* Desktop Button */}
        <Link to="/register" className="hidden md:block">
          <button className="bg-[#02011b] !text-white !text-sm font-semibold px-8 py-3 rounded-sm hover:bg-[#0d0c22] tracking-widest transition cursor-pointer">
            Sign Up
          </button>
        </Link>

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-gray-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <RiMenu2Line size={28} />
        </button>
      </nav>

      {/* Mobile Sidebar with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="sidebar"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-[50%] sm:w-[60%] h-full bg-white z-50 shadow-lg py-10 px px-6"
            >
              {/* Close Icon */}
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsOpen(false)}>
                  <X size={28} className="text-gray-800 cursor-pointer" />
                </button>
              </div>

              {/* Sidebar Links */}
              <ul className="flex flex-col space-y-6 text-lg font-medium text-gray-800">
                <li><Link to="#" onClick={() => setIsOpen(false)}>About</Link></li>
                <li><Link to="#" onClick={() => setIsOpen(false)}>Company</Link></li>
                <li><Link to="#" onClick={() => setIsOpen(false)}>Pricing</Link></li>
                <li><Link to="#" onClick={() => setIsOpen(false)}>Help</Link></li>
              </ul>

              {/* Sign Up Button */}
              <div className="mt-10">
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className=" bg-blue-950 !text-white px-8 py-3 rounded-md hover:bg-[#0d0c22] cursor-pointer transition">
                    Sign Up
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
