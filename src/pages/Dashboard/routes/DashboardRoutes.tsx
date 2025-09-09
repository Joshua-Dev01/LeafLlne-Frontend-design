// ...existing code...
import ProtectedRoute from "../../../routes/ProtectedRoute";
import { ChartsAnalytics } from "../Charts/Charts";
import DashboardLayout from "../components/DashboardLayout";
import DashboardHome from "../DashboardHome/components/DashboardHome";
import Projects from "../projects/Projects";

const DashboardRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "analytics",
        element: <ChartsAnalytics />,
      },
      // You can spread settings routes if needed:
      // ...SettingsRoutes,
    ],
  },
];

export default DashboardRoutes;
// ...existing code...