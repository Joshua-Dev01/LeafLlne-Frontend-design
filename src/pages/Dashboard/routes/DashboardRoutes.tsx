// src/pages/Dashboard/routes/DashboardRoutes.tsx
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";
import SubjectsRouter from "../Notes/router/SubjectsRoutes";
import SettingsRoutes from "../settings/routes/settingsRoutes";
import Notifications from "../notifications/Notifications";
import DashboardMainHome from "../DashboardHome/components/DashboardMainHome";
import EventsRouter from "../Events/routes/eventsRoutes";
import { Analytics } from "../Charts/analytics";
import ProjectsWrapper from "../projects/ProjectsWrapper";

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
        element: <DashboardMainHome />,
      },
      {
        path: "notifications", // /dashboard/projects
        element: <Notifications />,
      },
      {
        path: "projects", // /dashboard/projects
        element: <ProjectsWrapper />,
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