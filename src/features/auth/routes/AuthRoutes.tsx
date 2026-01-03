// src/features/auth/routes.ts

import ForgotPassword from "../forgottenPassword/components/ForgotPassword";
import Login from "../Login/components/Login";
import Register from "../register/components/SignUp";
import ResetPassword from "../reserPassword/components/ResetPassword";
import VerfiyEmail from "../verifyEmail/components/VerfiyEmail";


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

  {
    path: "verify-email",
    element: <VerfiyEmail />,
  },
];

export default authRoutes;
