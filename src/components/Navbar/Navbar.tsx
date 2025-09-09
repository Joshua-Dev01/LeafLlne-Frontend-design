import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu2Line } from "react-icons/ri";
import { Button } from "antd";

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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 
          flex justify-between items-center 
          px-6 md:px-12 py-3 w-[90%] md:w-[75%] 
          rounded-full backdrop-blur-lg transition-all duration-300
          ${scrolled
            ? "bg-white/90 shadow-lg"
            : "bg-white/40 shadow-md border border-white/20"
          }`}
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-[#04023a]">
          📚 <span className="text-[18px] font-mono">LeafLine</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-10 text-sm !mt-2 font-semibold text-gray-700">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>

        </ul>

        {/* Desktop Button */}
        <Link to="/auth/signup" className="hidden md:block">
          <Button className="!bg-[#0b083a] !text-white text-sm font-semibold !px-6 py-2 rounded-sm hover:bg-[#0d0c22] transition cursor-pointer">
            LogIn
          </Button>
        </Link>

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-gray-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <RiMenu2Line size={26} />
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
              className="fixed top-0 left-0 w-[70%] sm:w-[55%] h-full bg-gradient-to-b from-sky-100 via-white to-violet-50 z-50 shadow-lg py-10 px-6"
            >
              {/* Close Icon */}
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsOpen(false)}>
                  <X size={28} className="text-gray-800 cursor-pointer" />
                </button>
              </div>

              {/* Sidebar Links */}
              <ul className="flex flex-col space-y-6 text-lg font-medium text-gray-800">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>

              {/* Sign Up Button */}
              <div className="mt-10">
                <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button className="!bg-[#0b083a] !text-white !px-16 !py-2 rounded-full  transition cursor-pointer">
                    LogIn
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
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
