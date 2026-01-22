import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  console.log("user_test", user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
