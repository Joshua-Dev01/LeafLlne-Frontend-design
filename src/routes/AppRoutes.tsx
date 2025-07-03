// src/routes/AppRouter.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import FullScreenLoader from "../components/loading/loading";
import Register from "../features/auth/register/components/SignUp";
import Login from "../features/auth/Login/components/Login";
import ForgotPassword from "../features/auth/forgottenPassword/components/ForgotPassword";
import ResetPassword from "../features/auth/reserPassword/components/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../pages/Dashboard/components/DashboardLayout";

const Home = lazy(() => import("../pages/Home/Home"));

const AppRouter = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
