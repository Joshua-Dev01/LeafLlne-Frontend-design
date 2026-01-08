import { useState, type ReactNode } from "react";
import { EventsPage } from "./EventsPage";
import MyEvents from "./MyEvents";

interface Tab {
  id: string;
  // short label shown on the tab button
  label?: ReactNode;
  // component/content to render when this tab is active
  component?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="flex font-sans  gap-4 mb-7">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              py-3 px-5 rounded-sm cursor-pointer 
              ${
                isActive
                  ? "!bg-indigo-800 dark:!bg-indigo-900 !text-white shadow-md"
                  : " text-gray-700 hover:bg-gray-100 shadow-md bg-white dark:bg-transparent border border-white"
              }
            `}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Demo
export default function EventTabs() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs: Tab[] = [
    { id: "all", label: "All Events", component: <EventsPage /> },
    { id: "upcoming", label: "Upcoming", component: <MyEvents />},
  ];

  return (
    <div>
      <div>
        {/* Tab Component */}
        <Tabs tabs={tabs} defaultTab="all" onChange={setActiveTab} />
      </div>

      {/* Tab contents: prefer rendering the imported component when present */}
      <div>
        {tabs.find((t) => t.id === activeTab)?.component ?? (
          <div>{tabs.find((t) => t.id === activeTab)?.label}</div>
        )}
      </div>
    </div>

    
  );
}
