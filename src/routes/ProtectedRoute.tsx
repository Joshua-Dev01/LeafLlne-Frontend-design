import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token"); // or use AuthContext

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
