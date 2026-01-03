import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

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
  const [sort, setSort] = useState<"latest" | "date">("date");
  const [topic, setTopic] = useState("all");
  const [status, setStatus] = useState("all");
  const [openFilters, setOpenFilters] = useState(false);

  const buildQuery = () => {
    const params = new URLSearchParams({
      search,
      sort,
      page: "1",
      limit: "10",
    });

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
  }, [search, sort, topic, status]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 500);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  return (
    <div className="relative flex flex-col gap-4">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="
              w-full rounded-xl border border-gray-300 bg-white px-12 py-3 dark:bg-transparent
              shadow-sm text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
          />
        </div>

        {/* SORT */}
        <Select value={sort} onValueChange={(v) => setSort(v as any)}>
          <SelectTrigger className="w-[160px] rounded-xl border border-gray-300 shadow-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="date">Event Date</SelectItem>
          </SelectContent>
        </Select>

        {/* FILTER DROPDOWN BUTTON */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setOpenFilters((p) => !p)}
            className="rounded-xl border border-gray-300 px-4 py-3 flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal size={18} />

            <ChevronDown
              size={16}
              className={`transition-transform ${
                openFilters ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* FILTER PANEL */}
          {openFilters && (
            <div
              className="
              absolute right-0 mt-2 w-64 rounded-xl border  bg-white dark:bg-neutral-900
              shadow-lg p-4 space-y-4 z-50
            "
            >
              {/* TOPIC */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">
                    Topic
                  </label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="All topics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">
                    Status
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTopic("all");
                    setStatus("all");
                  }}
                >
                  Reset
                </Button>
                <Button
                  className="!bg-blue-950 !text-white"
                  size="sm"
                  onClick={() => setOpenFilters(false)}
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
