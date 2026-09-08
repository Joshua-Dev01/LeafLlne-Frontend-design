import { CreateEventForm } from "../components/AddEvents";
import { EventsWrapper } from "../components/EventWrapper";


const EventsRouter = [
  {
    path: "events",
    children: [
      {
        index: true,
        element: <EventsWrapper />,
      },
      {
        path: "create-event",
        element: <CreateEventForm />,
      },
    ],
  },
];

export default EventsRouter;
