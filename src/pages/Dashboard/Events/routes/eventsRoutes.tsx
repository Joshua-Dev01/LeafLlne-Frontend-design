import { CreateEventForm } from "../components/AddEvents";
import { EventsPage } from "../components/EventsPage";


const EventsRouter = [
  {
    path: "events",
    children: [
      {
        index: true,
        element: <EventsPage />,
      },
      {
        path: "create-event",
        element: <CreateEventForm />,
      },
    ],
  },
];

export default EventsRouter;
