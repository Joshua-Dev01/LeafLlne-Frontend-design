import { useEffect, useState, useCallback, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../../components/ui/select";

import { getAllEventsApi } from "../apis/eventsApi";
import type { PaginatedEvents } from "../types/eventsTypes";
import { handleResponse } from "../../../../utils/handleErrors";

interface Props {
  onResults: (data: PaginatedEvents) => void;
  onLoading: (loading: boolean) => void;
}

export const EventSearchBar = ({ onResults, onLoading }: Props) => {
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<"latest" | "name" | "date">(
    "latest"
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [topic, setTopic] = useState("all");
  const [status, setStatus] = useState("all");
  const [openFilters, setOpenFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilters(false);
      }
    };

    if (openFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilters]);

  const buildQuery = () => {
    const params = new URLSearchParams({
      search,
      filterBy,
      page: "1",
      limit: "10",
    });

    if (filterBy === "date" && selectedDate) {
      params.append("date", selectedDate);
    }
    if (topic !== "all") params.append("topic", topic);
    if (status !== "all") params.append("status", status);

    return params.toString();
  };

  const fetchEvents = useCallback(async () => {
    try {
      onLoading(true);
      const data = await getAllEventsApi(buildQuery());
      onResults(data);
    } catch (error) {
      handleResponse({ error });
    } finally {
      onLoading(false);
    }
  }, [search, filterBy, selectedDate, topic, status, onLoading, onResults]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 500);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleReset = () => {
    setFilterBy("latest");
    setSelectedDate("");
    setTopic("all");
    setStatus("all");
  };

  const hasActiveFilters =
    filterBy !== "latest" ||
    topic !== "all" ||
    status !== "all" ||
    selectedDate !== "";

  return (
    <div className="relative w-full">
      {/* SEARCH BAR WITH FILTER */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="
              w-full rounded-lg sm:rounded-xl border border-gray-200 bg-white 
              pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3
              text-sm sm:text-base text-gray-800 placeholder-gray-400
              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
          />
        </div>

        {/* FILTER BUTTON */}
        <div className="relative" ref={filterRef}>
          <Button
            variant="outline"
            onClick={() => setOpenFilters((p) => !p)}
            className={`
              relative rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 
              shadow-sm hover:shadow-md transition-all duration-200
              ${
                openFilters
                  ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-950"
                  : "border-gray-200"
              }
              ${hasActiveFilters ? "border-indigo-500" : ""}
            `}
          >
            <SlidersHorizontal
              size={18}
              className={hasActiveFilters ? "text-indigo-600" : ""}
            />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </Button>

          {/* FILTER DROPDOWN PANEL */}
          {openFilters && (
            <div
              className="
              absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 
              rounded-xl border border-gray-200 bg-white 
              dark:bg-neutral-900 dark:border-neutral-700
              shadow-xl p-4 sm:p-5 space-y-4 z-50
            "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <button
                  onClick={() => setOpenFilters(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* FILTER BY */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter By
                </label>
                <Select
                  value={filterBy}
                  onValueChange={(v) => setFilterBy(v as any)}
                >
                  <SelectTrigger className="w-full rounded-lg border-gray-200 dark:border-neutral-700">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DATE INPUT (shown only when "date" is selected) */}
              {filterBy === "date" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="
                      w-full rounded-lg border border-gray-200 bg-white px-3 py-2
                      text-sm text-gray-800 
                      dark:bg-neutral-800 dark:border-neutral-700 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      transition-all
                    "
                  />
                </div>
              )}

              {/* TOPIC */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Topic
                </label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200 dark:border-neutral-700">
                    <SelectValue placeholder="All topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200 dark:border-neutral-700">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-neutral-700">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 rounded-lg border-gray-200 dark:border-neutral-700"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setOpenFilters(false)}
                  className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
