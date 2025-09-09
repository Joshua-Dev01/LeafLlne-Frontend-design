import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import Home from "../pages/Home/Home";
import authRoutes from "../features/auth/routes/AuthRoutes";

import FullScreenLoader from "../components/loading/loading";
import Nopage from "../components/NoPage/NoPage";
import DashboardRoutes from "../pages/Dashboard/routes/DashboardRoutes";
import AboutUs from "../pages/about/About";
import Contact from "../pages/contact/Contact";


const router = createBrowserRouter([
  {
    path: "*",
    element: <Nopage />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <AboutUs />
  },
    {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/auth",
    children: [...authRoutes],
  },
  {
    path: "/dashboard",
   
    children: [...DashboardRoutes],
  },
]);

const AppRouter = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;
