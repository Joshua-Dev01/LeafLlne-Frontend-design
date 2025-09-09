import React from "react";
import { Button } from "antd";
import AboutUsIllustration from "../../assets/heroImg.png"; // ✅ Place your SVG with the 3 images here
import Navbar from "../../components/Navbar/Navbar";
import AOS from "aos";
import Footer from "../../components/footer/Footer";
import FAQSection from "./FAQSection";
import { motion, MotionConfig } from "framer-motion";

// initialize AOS on load
AOS.init();

const AboutUs: React.FC = () => {
  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-violet-50 px-6 md:px-15 pt-36">
        <div className="flex items-center justify-around flex-wrap">

          {/* Text Section */}
          <div data-aos="fade-right" className="space-y-6 max-w-2xl relative z-10 md:text-left text-center">
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 ">
              ABOUT US
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              LeafLine is your modern study hub, a platform designed to help
              students collaborate, share notes, and grow together. From uploading
              and organizing PDF study materials, to collaborating with peers and
              taking practice tests, LeafLine makes learning smarter and more
              engaging. We believe that education thrives when knowledge is shared.
            </p>

            <Button className="!bg-[#0b083a] hover:bg-blue-950 !px-6 !py-5 h-auto !text-white rounded-md shadow-md">
              Explore More
            </Button>
          </div>

          {/* Image Section */}
          <div className="flex justify-center mt-10 md:mt-0" data-aos="fade-left">
            <MotionConfig>
              <motion.img
                src={AboutUsIllustration}
                alt="LeafLine Book Preview"
                className="w-[80%] max-w-md md:max-w-full lg:max-w-xl object-contain drop-shadow-2xl"
                // Floating + slight right rotation
                animate={{
                  y: [0, -10, 0],
                  rotate: [1, 7, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              />
            </MotionConfig>
          </div>
        </div>
      </section>

      <FAQSection />
      <Footer />
    </div>
  );
};

export default AboutUs;
