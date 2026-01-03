import { motion } from "framer-motion";
import phone from "../../assets/phone.png"; // replace with your image
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const categories = [
  {
    title: "Study Analytics",
    color: "bg-red-500",
    desc: "Track your learning journey with smart analytics. Monitor your reading time, completed books, and study goals to stay motivated and organized.",
  },
  {
    title: "AI Practice Tests",
    color: "bg-blue-500",
    desc: "Challenge yourself with AI-powered quizzes and mock exams. Get instant feedback, identify weak areas, and improve your knowledge step by step.",
  },
  {
    title: "Collaboration",
    color: "bg-green-500",
    desc: "Join study groups, share notes, and discuss topics with peers. LeafLine makes learning more engaging through collaboration and knowledge sharing.",
  },
];

export default function CategoriesSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true, // whether animation should happen only once
      offset: 100, // trigger point offset
    });
  }, []);

  return (
    <section className="relative py-20 px-6 md:px-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">
        {/* Left: Phone / Image */}
        <motion.div className="flex justify-center " data-aos="fade-right">
          <div className="relative">
            <img
              src={phone}
              alt="LeafLine App Preview"
              className="w-72 md:w-96 drop-shadow-2xl"
            />
            {/* Decorative circle behind */}
            <div className="absolute -z-10 top-10 left-10 w-72 h-72 rounded-full bg-blue-100"></div>
          </div>
        </motion.div>

        {/* Right: Cards */}
        <div className="space-y-8">
          <p className="font-bold text-3xl text-center !mb-16">
            {" "}
            Explore What LeafLine Offers
          </p>

          {categories.map((cat, index) => (
            <motion.div
              key={index}
              className="border border-gray-300 rounded-lg p-6 shadow-md relative bg-white hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              data-aos="fade-down"
            >
              {/* Title Label */}
              <span
                className={`${cat.color} text-white px-4 py-1 rounded-md text-sm font-semibold absolute -top-4 left-4`}
              >
                {cat.title}
              </span>

              {/* Description */}
              <p className="text-gray-700 mt-4 leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
