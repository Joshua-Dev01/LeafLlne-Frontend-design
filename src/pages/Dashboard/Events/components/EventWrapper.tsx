import { Link } from "react-router-dom";
import { EventSearchBar } from "./SearchEvents";
import { Button } from "../../../../components/ui/button";
import { PlusCircle } from "lucide-react";
import EventTabs from "./EventsTabs";

export const EventWrapper = () => {
  return (
    <div className="font-sans">
      <div className="flex items-center justify-between  mb-5">
        <p className="font-semibold text-2xl ">Events</p>

        <Link to="create-event">
          <Button className="bg-blue-900 !text-white cursor-pointer dark:bg-transparent dark:border dark:border-gray-500">
            <PlusCircle />
            Create Event
          </Button>
        </Link>
      </div>

      {/* events searchbar */}
      <div className="mb-5">
        <EventSearchBar />
      </div>

      {/* Events Tabs */}

      <div>
        <EventTabs />
      </div>
    </div>
  );
};
