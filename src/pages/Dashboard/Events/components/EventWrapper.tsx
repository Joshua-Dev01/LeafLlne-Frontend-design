import { Routes, Route } from "react-router-dom";
import { EventsPage } from "./EventsPage";
import { CreateEventForm } from "./AddEvents";

export const EventsWrapper = () => (
  <Routes>
    <Route index element={<EventsPage />} />
    <Route path="create" element={<CreateEventForm />} />
  </Routes>
);
