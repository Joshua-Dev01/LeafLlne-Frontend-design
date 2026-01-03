import React, { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  allEvents: React.ReactNode;
  myEvents: React.ReactNode;
}

const EventsTabs: React.FC<Props> = ({ allEvents, myEvents }) => {
  const [activeTab, setActiveTab] = useState<"events" | "my-events">("events");

  return (
    <div className="w-full">
      {/* TAB HEADER */}
      <div className="flex gap-4 border-b dark:border-zinc-700 mb-8">
        {[
          { key: "events", label: "Events" },
          { key: "my-events", label: "My Events" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`relative px-6 py-3 text-sm font-semibold transition
              ${
                activeTab === tab.key
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              }
            `}
          >
            {tab.label}

            {/* ACTIVE INDICATOR */}
            {activeTab === tab.key && (
              <motion.div
                layoutId="active-tab"
                className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[200px]">
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {allEvents}
          </motion.div>
        )}

        {activeTab === "my-events" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {myEvents}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsTabs;
