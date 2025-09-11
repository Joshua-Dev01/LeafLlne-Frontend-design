import { useState } from "react";
import { Input, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Search Icon (trigger) */}
      <div
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <SearchOutlined className="!text-xl !text-gray-300" />
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
        <div className="bg-[#1f1f1f] p-4 rounded-lg">
          {/* Search Input */}
          <Input
            placeholder="Search your favourite books..."
            prefix={<SearchOutlined className="!text-gray-400" />}
            className="!w-full !py-3 !px-4 !rounded-lg !bg-[#2a2a2a] !text-white placeholder:!text-white"
            autoFocus
          />

          {/* History */}
          <div className="mt-4 space-y-2 text-gray-200">
            <p className="text-sm text-gray-400">Recent Searches</p>
            <div className="p-2 hover:bg-[#333333] rounded-md cursor-pointer">
              📘 Assignment Tracker
            </div>
            <div className="p-2 hover:bg-[#333333] rounded-md cursor-pointer">
              Getting Started on Mobile
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchBar;
