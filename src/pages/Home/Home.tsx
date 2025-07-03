// src/pages/HeroSection/Hero.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeImage from "../../../src/assets/homebook.png";
import Navbar from "../../components/Navbar/Navbar";
import FeatureSection from "./FeatureSection";
import BookShowcase from "./BookShowcase";
import TestimonialCarousel from "./TestimonialCarousel";
import StatsSection from "./Stats";
import Footer from "../../components/footer/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white px-15  py-15">

      {/* Navbar */}
      <Navbar />

      <div className="flex flex-col md:flex-row justify-between items-center space-y-10 md:space-y-10 mt-20 font-sans">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 space-y-6"
        >
          <p className="text-sm text-[#0d0c22] uppercase tracking-widest">
            Your Gateway to Knowledge
          </p>
          <p className="text-3xl  font-bold leading-snug">
            Read. <span className="text-[#141355]">Download.</span> Grow with{" "}
            <span className="text-green-900">LeafLine</span>
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            LeafLine is your personal digital library. Access thousands of books across all genres — read online or download and take them anywhere.
          </p>
          <div className="flex space-x-4 pt-4">
            <Link to={"/register"}>
              <button className="bg-[#02011b] hover:bg-[#0f0f16] cursor-pointer !text-white px-6 py-3 rounded-sm shadow transition">
                View more books
              </button>
            </Link>

          </div>
        </motion.div>

        {/* 3D Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex justify-center relative h-[500px]"
        >
          <img
            src={HomeImage}
            alt="LeafLine Book Preview"
            className="h-full w-full object-contain drop-shadow-xl"
          />
        </motion.div>
      </div>
      <BookShowcase />
      <FeatureSection />
      <StatsSection />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
};

export default Home;
