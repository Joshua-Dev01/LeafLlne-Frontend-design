// src/components/FeatureSection.tsx
import { BookOpen, Users, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function FeatureSection() {

    useEffect(() => {
          AOS.init({
              duration: 1000, // animation duration in ms
              once: true, // whether animation should happen only once
              offset: 100, // trigger point offset
          });
      }, []);

  const features = [
    {
      icon: <BookOpen className="w-10 h-10 text-white" />,
      title: "Organized Learning",
      description:
        "Keep track of your courses, notes, and progress in one central hub.",
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: "Study Communities",
      description:
        "Connect with students, share resources, and learn together effectively.",
      bg: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      icon: <FileText className="w-10 h-10 text-white" />,
      title: "Resource Library",
      description:
        "Access shared PDFs, documents, and study guides from peers.",
      bg: "bg-gradient-to-br from-green-400 to-green-600",
    },
  ];

  const floatingShapes = [
    {
      className: "w-10 h-10 bg-indigo-400 rounded-full opacity-70 blur-sm",
      position: "top-10 left-10",
      animate: { y: [0, -25, 0], x: [0, 20, 0] },
    },
    {
      className:
        "w-0 h-0 border-l-[18px] border-r-[18px] border-b-[30px] border-transparent border-b-pink-400 opacity-70",
      position: "bottom-10 left-10",
      animate: { y: [0, 20, 0], x: [0, -20, 0], rotate: [0, 15, -15, 0] },
    },
    {
      className: "w-8 h-8 bg-green-400 rotate-45 opacity-70",
      position: "top-10 right-10",
      animate: { y: [0, -30, 0], x: [0, -25, 0], rotate: [0, 20, -20, 0] },
    },
    {
      className: "w-12 h-12 bg-yellow-300 rounded-full blur-sm opacity-60",
      position: "bottom-10 right-10",
      animate: { y: [0, 25, 0], x: [0, 15, 0] },
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Floating shapes at the 4 edges */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.className} ${shape.position}`}
          initial={{ opacity: 0.7 }}
          animate={shape.animate}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{ zIndex: 30 }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-6 text-center relative z-20 font-sans">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 my-16">
          Why Choose <span className="text-indigo-900 font-bold">Study Hub?</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto my-20">
          Everything you need to organize your learning, connect with others,
          and achieve academic success.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-20" data-aos="fade-right" >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.bg} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 text-white`  }
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="opacity-90">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
