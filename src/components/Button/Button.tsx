import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const AddButton: React.FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex items-center gap-2 px-3 py-2 
        bg-gradient-to-r from-gray-500 to-blue-950
        text-white font-semibold rounded-xl 
        shadow-lg hover:shadow-xl transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-white
        cursor-pointer
      "
    >
      <Plus className="w-5 h-5" />
      Add Subject
    </motion.button>
  );
};

export default AddButton;
