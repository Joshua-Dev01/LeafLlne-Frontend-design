import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const AddButton: React.FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex items-center gap-2 px-5 py-2
        bg-gradient-to-r from-[#1e293b] to-[#0f172a] 
        
        text-white font-semibold rounded-sm
        shadow-md hover:shadow-xl 
        transition-all duration-300
        border border-white/10
        hover:border-blue-500/40
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        cursor-pointer
      "
    >
      <Plus className="w-5 h-5 text-white" />
      <span className="tracking-wide text-white">Add</span>
    </motion.button>
  );
};

export default AddButton;
