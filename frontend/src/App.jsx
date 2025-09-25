import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./zustand/store/useAuthStore";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoutes";
import VerifyEmail from "./pages/VerifyEmail";


import {Toaster} from 'react-hot-toast';

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px,linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" /> */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <div className="z-20 w-full">
        <Routes>
          {/* Protected route */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiresAuth>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requiresAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute requiresAuth={false}>
                <SignUpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <ProtectedRoute requiresAuth={false}>
                <VerifyEmail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
