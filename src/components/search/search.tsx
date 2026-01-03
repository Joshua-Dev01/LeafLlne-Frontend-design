import { useState } from "react";
import { Input, Modal } from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Search Icon (trigger) */}
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        <SearchOutlined className="!text-xl dark:!text-gray-300 !text-black" />
      </div>

      {/* Search Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        width="700px"
        centered
        className="custom-search-modal"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className=" bg-gray-50 dark:bg-gradient-to-br dark:from-[#07080ad8] dark:to-[#05080e]  p-6 rounded-2xl shadow-2xl"
        >
          {/* Search Input */}
          <Input
            placeholder="Search your for work ."
            prefix={<SearchOutlined className="!text-gray-400 text-lg" />}
            className="!w-full !h-12 !rounded-xl !bg-blue-100 dark:!bg-[#2a2a2a]/70 !text-white placeholder:!text-gray-400 
                       focus:!ring-2 focus:!ring-blue-500 focus:!border-none transition-all"
            autoFocus
          />

          {/* History */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
              <ClockCircleOutlined /> Recent Searches
            </p>

            <div className="flex flex-col gap-2 text-black dark:text-gray-200">
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition cursor-pointer">
                <span className=" "> 📘Assignment Tracker</span>
                <span>
                  <CloseOutlined />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition cursor-pointer">
                <span className=""> 📱 Events </span>
                <span>
                  <CloseOutlined />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default SearchBar;
