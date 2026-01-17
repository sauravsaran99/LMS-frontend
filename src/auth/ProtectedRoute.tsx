import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[]; // optional
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // 🔄 wait until auth state is resolved
  if (loading) {
    return null; // or loader
  }

  // 🔐 not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // 🚫 role not allowed
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ allowed
  return children;
};

export default ProtectedRoute;
