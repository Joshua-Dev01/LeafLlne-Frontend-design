import { CreateEventForm } from "../components/AddEvents";
import { EventWrapper } from "../components/EventWrapper";


const EventsRouter = [
  {
    path: "events",
    children: [
      {
        index: true,
        element: <EventWrapper />,
      },
      {
        path: "create-event",
        element: <CreateEventForm />,
      },
    ],
  },
];

export default EventsRouter;
