// src/components/BookSlider3D.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const books = [
  {
    id: 1,
    image:
      "https://jeffdegraff.com/wp-content/uploads/2018/07/THE-INNOVATION-CODE.png",
  },
  {
    id: 2,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
  },
  {
    id: 3,
    image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
  },
];

const BookSlider3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % books.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] w-full flex justify-center items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={books[activeIndex].id}
          src={books[activeIndex].image}
          initial={{ opacity: 0, x: 200, rotateY: -90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -200, rotateY: 90 }}
          transition={{ duration: 0.8 }}
          className="w-[240px] h-auto drop-shadow-2xl rounded-md hover:scale-105 transition-transform duration-500 cursor-pointer"
        />
      </AnimatePresence>
    </div>
  );
};

export default BookSlider3D;
