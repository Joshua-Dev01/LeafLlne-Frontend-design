import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const SearchBar = () => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`
        transition-all duration-300
        ${focused ? "w-full md:w-[600px]" : "w-[250px] md:w-[200px]"}
      `}
    >
      <Input
        name="searchstring"
        className={`
          !w-full !py-2 px-10 !border-none !bg-gray-100
          focus:!ring-2 focus:!ring-blue-400
          transition-all duration-300
        `}
        placeholder="Search your favourite books"
        prefix={<SearchOutlined className="text-[18px]" />}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

export default SearchBar;
