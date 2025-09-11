import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeImage from "../../../src/assets/dashboard.png";
import Navbar from "../../components/Navbar/Navbar";
import FeatureSection from "./FeatureSection";
import CategoriesSection from "./categories";
import Stats from "./Stats";
import TestimonialCarousel from "./TestimonialCarousel";

import Footer from "../../components/footer/Footer";

const Home = () => {
  return (
    <div className="">
      {/* Navbar */}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-violet-50 px-6 md:px-15 pt-15">
        <div className="relative grid place-items-center mt-20 font-sans gap-12 overflow-hidden">
          {/* 🔵 Floating Shapes */}
          <motion.div
            className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full opacity-30 blur-2xl"
            animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-16 w-32 h-32 bg-gradient-to-tr from-green-400 to-teal-500 rounded-xl opacity-30 blur-2xl"
            animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-1/3 w-16 h-16 bg-gradient-to-tr from-pink-400 to-red-500 rounded-full opacity-30 blur-xl"
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-1/4 w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-lg opacity-30 blur-lg"
            animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 text-center max-w-2xl relative z-10 px-10"
          >
            <p className="text-sm text-[#0d0c22] uppercase tracking-widest">
              Your Gateway to Knowledge
            </p>
            <p className="text-3xl font-bold leading-snug">
              Read. <span className="text-[#141355]">Study.</span> Grow with{" "}
              <span className="text-green-900">LeafLine</span>
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              LeafLine is your personal digital Study hub. Access thousands of
              studing and also  read online books and arranging your notes
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              <Link to={"/auth/signup"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#0b083a] hover:bg-[#0f0f16] cursor-pointer !text-white px-6 py-3 rounded-md shadow-lg transition"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative h-[400px] w-full flex justify-center z-10 px-10"
          >
            <motion.img
              src={HomeImage}
              alt="LeafLine Book Preview"
              className="h-64 w-auto object-contain drop-shadow-2xl"
              whileHover={{ rotate: 2, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
          </motion.div>
        </div>
      </div>

      <CategoriesSection />
      <FeatureSection />
      <Stats />

      <TestimonialCarousel />
      <Footer />
    </div>
  );
};

export default Home;
