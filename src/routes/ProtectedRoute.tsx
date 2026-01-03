import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token"); // or use AuthContext
  const isVerified = localStorage.getItem("isVerified") === "true";

  // Allow access to protected routes when the user is logged in (token)
  // or has just verified their email (isVerified set by verify flow).
  // This enables the verify flow to navigate directly to /dashboard.
  if (!token && !isVerified) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
