import React, { useState } from "react";
import { useAuthStore } from "../zustand/store/useAuthStore";
import BoarderAnimatedContainer from "../components/BoarderAnimatedContainer";
import LoginImg from "/login.png";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    identifier: "", // can be username OR email
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     await login(formData); // login from your store
   } catch (error) {
     // Clear only the password if login fails
     console.error("Login failed:", error);
     setFormData((prev) => ({ ...prev}));
     setShowPassword(false);
   }
 };


  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl md:h-auto h-auto">
        <BoarderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">Login to access your account.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* USERNAME OR EMAIL */}
                  <div>
                    <label htmlFor="identifier" className="auth-input-label">
                      Username or Email
                    </label>
                    <div className="relative">
                      {formData.identifier.includes("@") ? (
                        <MailIcon className="auth-input-icon" />
                      ) : (
                        <UserIcon className="auth-input-icon" />
                      )}
                      <input
                        type="text"
                        value={formData.identifier}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            identifier: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="Enter username or email"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label htmlFor="password" className="auth-input-label">
                      Password
                    </label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className={`auth-btn ${
                      isLoggingIn
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderCircleIcon className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don’t have an account?{" "}
                    <span className="underline">Sign Up</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM IMAGE -RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src={LoginImg}
                  alt="Login Image"
                  className="object-contain w-full h-auto"
                />

                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect anytime, anywhere
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Secure</span>
                    <span className="auth-badge">Fast</span>
                    <span className="auth-badge">Reliable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BoarderAnimatedContainer>
      </div>
    </div>
  );
};

export default LoginPage;
