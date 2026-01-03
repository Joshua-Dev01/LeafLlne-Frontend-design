import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu2Line } from "react-icons/ri";
import { Button } from "antd";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 
          flex justify-between items-center px-6 md:px-12 py-3 w-[90%] md:w-[75%] 
          rounded-full backdrop-blur-xl transition-all duration-300
          ${
            scrolled
              ? "bg-black/70 shadow-lg border border-gray-700"
              : "bg-black/50 shadow-md border border-gray-800"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-10 text-sm font-semibold text-gray-300">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        {/* Desktop Button */}
        <Link to="/auth/signup" className="hidden md:block">
          <Button className="!bg-indigo-950 !text-white text-sm font-semibold !px-6 py-2 rounded-full hover:!bg-indigo-500 transition">
            LogIn
          </Button>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(true)}
        >
          <RiMenu2Line size={26} />
        </button>
      </nav>

      {/* Mobile Sidebar */}
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
              className="fixed top-0 left-0 w-[70%] sm:w-[55%] h-full bg-black/95 z-50 shadow-xl py-10 px-6"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsOpen(false)}>
                  <X size={28} className="text-white cursor-pointer" />
                </button>
              </div>

              <ul className="flex flex-col space-y-6 text-lg font-medium text-white">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>

              <div className="mt-10">
                <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button className="!bg-indigo-600 !text-white !px-16 !py-2 rounded-full hover:!bg-indigo-500 transition">
                    LogIn
                  </Button>
                </Link>
              </div>
            </motion.div>

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
