import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admin-token");
  const location = useLocation();

  if (!token) {
    // If there is no token, redirect to the admin login page.
    // Pass the original location they tried to visit in state.
    return <Navigate to="/login/admin" state={{ from: location }} replace />;
  }

  // If the token exists, render the component they wanted to access.
  return children;
};

export default ProtectedRoute;