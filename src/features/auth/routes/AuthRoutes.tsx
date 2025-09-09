// src/features/auth/routes.ts

import ForgotPassword from "../forgottenPassword/components/ForgotPassword";
import Login from "../Login/components/Login";
import Register from "../register/components/SignUp";
import ResetPassword from "../reserPassword/components/ResetPassword";


const authRoutes = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Register />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
];

export default authRoutes;
