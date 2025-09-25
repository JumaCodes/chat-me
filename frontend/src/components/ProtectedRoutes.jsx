import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustand/store/useAuthStore";
import Loading from "./Loading";

const ProtectedRoute = ({ children, requiresAuth }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Loading />;

  // Protected route → needs auth
  if (requiresAuth && !authUser) {
    return <Navigate to="/login" replace />;
  }

  // Public route → redirect if already logged in
  if (!requiresAuth && authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

