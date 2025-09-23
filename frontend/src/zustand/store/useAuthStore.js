import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: {},
    isLoading: false,

    login: () => {
        console.log("login");
        set({ isLoading: true })
    }
}));