import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

interface ProjectSearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (status: string) => void;
  defaultStatus?: string;
}

const statuses = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

export const ProjectSearchBar: React.FC<ProjectSearchBarProps> = ({
  onSearch,
  onFilter,
  defaultStatus = "all",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleStatusSelect = (value: string) => {
    setStatus(value);
    onFilter(value);
    setOpenDropdown(false);
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-xl border shadow-sm relative">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <Search size={18} className="text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search projects or tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
      </div>

      {/* Filter dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown((prev) => !prev)}
          className="flex items-center gap-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          <Filter size={18} />
          <span className="text-sm">
            {statuses.find((s) => s.value === status)?.label}
          </span>
          <ChevronDown size={16} />
        </button>

        {openDropdown && (
          <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => handleStatusSelect(s.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  s.value === status
                    ? "font-semibold text-indigo-600 dark:text-indigo-400"
                    : ""
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
