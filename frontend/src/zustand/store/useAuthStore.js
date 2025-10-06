import { create } from 'zustand';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignedIn: false,
  isSigningUp: false,
  isLoggingIn: false,
  isProfileUpdating: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user, isCheckingAuth: false });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success(res.data.message);
      // Inform user to check email
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error signing up");
      console.error("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async ({ identifier, password }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        identifier,
        password,
      });

      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in");
      console.error("Error logging in:", error);
      set({ authUser: null });
      throw error; // 👈 rethrow so form can catch it
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isProfileUpdating: true }); // start loading

      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data, isProfileUpdating: false });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile:", error);

      toast.error(
        error?.response?.data?.message || "Error updating your profile"
      );

      set({ isProfileUpdating: false }); // stop loading even on error
    }
  },
}));