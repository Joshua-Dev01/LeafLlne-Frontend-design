// src/routes/routes.tsx

import Home from "../pages/Home/Home";



export const publicRoutes = [
  { path: "/", element: Home },
  // { path: "dashboard", element: DashBoard },
  // { path: "/signup", element: Signup },
];

// Later: Add protected and admin routes too
