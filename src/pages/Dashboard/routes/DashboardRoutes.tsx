// src/pages/Dashboard/routes/DashboardRoutes.tsx
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";
import SubjectsRouter from "../Notes/router/SubjectsRoutes";
import SettingsRoutes from "../settings/routes/settingsRoutes";
import Notifications from "../notifications/Notifications";
import DashboardMainHome from "../DashboardHome/components/DashboardMainHome";
import ViewNotePage from "../Notes/NotesFiles/components/ViewNote";
import EventsRouter from "../Events/routes/eventsRoutes";
import { Analytics } from "../Charts/analytics";

const DashboardRoutes = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // /dashboard
        element: <DashboardMainHome userName="User" />,
      },
      {
        path: "notifications", // /dashboard/projects
        element: <Notifications />,
      },
      {
        path: "projects", // /dashboard/projects
        element: <ViewNotePage />,
      },
      ...SubjectsRouter,
      ...SettingsRoutes,
      ...EventsRouter,
      {
        path: "analytics", // /dashboard/analytics
        element: <Analytics />,
      },
    ],
  },
];

export default DashboardRoutes;
