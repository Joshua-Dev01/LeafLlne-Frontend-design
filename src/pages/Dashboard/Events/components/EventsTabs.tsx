import { useState } from "react";
import { EventsPage } from "./EventsPage";
import MyEvents from "./MyEvents";
import type { Event } from "../types/eventsTypes";

interface Props {
  searchResults: Event[] | null;
  searchLoading: boolean;
}

const TABS = [
  { id: "all",  label: "All Events" },
  { id: "mine", label: "My Events"  },
];

export default function EventTabs({ searchResults, searchLoading }: Props) {
  const [active, setActive] = useState("all");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/6 rounded-xl w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 font-['DM_Sans',sans-serif]
              ${active === tab.id
                ? "bg-white dark:bg-[#0F1A2E] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/60"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === "all"  && (
        <EventsPage
          searchResults={searchResults}
          searchLoading={searchLoading}
        />
      )}
      {active === "mine" && <MyEvents />}
    </div>
  );
}