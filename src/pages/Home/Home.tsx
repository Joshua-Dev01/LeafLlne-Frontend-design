import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeImage from "../../../src/assets/mainHomeImg.png";
import Navbar from "../../components/Navbar/Navbar";
import FeatureSection from "./FeatureSection";
import CategoriesSection from "./categories";
import Stats from "./Stats";
import TestimonialCarousel from "./TestimonialCarousel";
import Footer from "../../components/footer/Footer";

const Home = () => {
  return (
    <div className="bg-[#0f0f16] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center top-30 justify-center px-6 md:px-16 relative overflow-hidden">
        {/* 🔵 Floating Shapes */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 rounded-full opacity-30 blur-3xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500"
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-16 w-32 h-32 rounded-xl opacity-30 blur-3xl bg-gradient-to-tr from-green-500 via-teal-400 to-cyan-500"
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-1/3 w-16 h-16 rounded-full opacity-30 blur-2xl bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-1/4 w-20 h-20 rounded-lg opacity-30 blur-2xl bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-400"
          animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6 max-w-2xl"
        >
          <p className="text-sm text-indigo-400 uppercase tracking-widest">
            Your Gateway to Knowledge
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-snug">
            Read. <span className="text-indigo-400">Study.</span> Grow with{" "}
            <span className="text-green-400">LeafLine</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            LeafLine is your personal digital study hub. Access thousands of
            study materials, read online books, and organize your notes
            efficiently.
          </p>
          <Link to={"/auth/signup"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-12"
        >
          <motion.img
            src={HomeImage}
            alt="LeafLine Book Preview"
            className="w-full  object-contain drop-shadow-2xl rounded-xl"
            whileHover={{ rotate: 2, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 120 }}
          />
        </motion.div>
      </div>

      {/* Sections */}
      <CategoriesSection />
      <FeatureSection />
      <Stats />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
};

export default Home;
