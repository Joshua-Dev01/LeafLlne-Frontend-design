// import React from "react";
// import { Result, Button } from "antd";

// interface LoadingErrorProps {
//   onRetry?: () => void; // ✅ optional prop to retry fetching data
// }

// const LoadingError: React.FC<LoadingErrorProps> = ({ onRetry }) => (
//   <Result
//     status="500"
//     title={<span className="text-white">500</span>}
//     subTitle={
//       <span className="text-gray-200">
//         Sorry, something went wrong. Please try again.
//       </span>
//     }
//     extra={
//       onRetry && (
//         <Button
//           type="primary"
//           onClick={onRetry}
//           className="!bg-blue-800 !border-4 !px-6"
//         >
//           Retry
//         </Button>
//       )
//     }
//     className=""
//   />
// );

// export default LoadingError;


import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface LoadingErrorProps {
  onRetry?: () => void;
  message?: string;
}

const LoadingError = ({ onRetry, message }: LoadingErrorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-16"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-4"
      >
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </motion.div>

      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
        Oops! Something went wrong.
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
        {message ||
          "We couldn’t load your data right now. Please check your connection and try again."}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-blue-900 hover:bg-blue-700 text-white rounded-lg px-5 py-2 transition-all cursor-pointer duration-200"
        >
          Retry
        </Button>
      )}
    </motion.div>
  );
};

export default LoadingError;
