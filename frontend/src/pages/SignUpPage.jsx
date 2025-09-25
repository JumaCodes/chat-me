import React, { useState, useEffect } from "react";
import { useAuthStore } from "../zustand/store/useAuthStore";
import BoarderAnimatedContainer from "../components/BoarderAnimatedContainer";
import LoginImg from "/login.png";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  AtSign,
  LoaderCircleIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Link } from "react-router";

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  // Capitalize helper
  const capitalize = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  // Password validation checks
  const passwordChecks = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  // Check if all conditions are true
  const allChecksPassed =
    passwordChecks.length && passwordChecks.uppercase && passwordChecks.special;

  // 🔹 Simulated API call to check username
  const checkUsernameAvailability = async (username) => {
    if (!username) {
      setUsernameError("");
      setUsernameSuggestions([]);
      return;
    }

    try {
      // Replace this fetch URL with your backend endpoint
      const res = await fetch(`/api/check-username?username=${username}`);
      const data = await res.json();

      if (data.exists) {
        setUsernameError("Username already taken");
        // Generate 3 suggestions
        const suggestions = Array.from({ length: 3 }, () => {
          const rand = Math.floor(100 + Math.random() * 900);
          return `${username}${rand}`;
        });
        setUsernameSuggestions(suggestions);
      } else {
        setUsernameError("");
        setUsernameSuggestions([]);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  // 🔹 Trigger username check on input change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      checkUsernameAvailability(formData.username);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.username]);

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
                    Create Account
                  </h2>
                  <p className="text-slate-400">Sign up for a new account.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* FIRST NAME */}
                  <div>
                    <label htmlFor="firstName" className="auth-input-label">
                      First Name
                    </label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: capitalize(e.target.value),
                          })
                        }
                        className="input"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* LAST NAME */}
                  <div>
                    <label htmlFor="lastName" className="auth-input-label">
                      Last Name
                    </label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: capitalize(e.target.value),
                          })
                        }
                        className="input"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* USERNAME */}
                  <div>
                    <label htmlFor="username" className="auth-input-label">
                      Username
                    </label>
                    <div className="relative">
                      <AtSign className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="input"
                        placeholder="johndoe123"
                      />
                    </div>
                    {usernameError && (
                      <p className="text-red-500 text-sm mt-2">
                        {usernameError}
                      </p>
                    )}
                    {usernameSuggestions.length > 0 && (
                      <div className="text-slate-400 text-sm mt-1">
                        Suggestions:{" "}
                        {usernameSuggestions.map((s, i) => (
                          <span
                            key={i}
                            className="cursor-pointer hover:text-slate-200 mr-2"
                            onClick={() =>
                              setFormData({ ...formData, username: s })
                            }
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label htmlFor="email" className="auth-input-label">
                      Email
                    </label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="johndoe@example.com"
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

                    {/* Password Requirements */}
                    <div className="mt-3 space-y-2 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        {passwordChecks.length ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span>At least 6 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordChecks.uppercase ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span>At least 1 uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordChecks.special ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span>At least 1 special symbol</span>
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className={`auth-btn ${
                      isSigningUp || !allChecksPassed
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    type="submit"
                    disabled={isSigningUp || !allChecksPassed}
                  >
                    {isSigningUp ? (
                      <LoaderCircleIcon className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account?{" "}
                    <span className="underline">Login</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM IMAGE -RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src={LoginImg}
                  alt="Sign Up Image"
                  className="object-contain w-full h-auto"
                />

                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Start your Journey Today</h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
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

export default SignUpPage;
