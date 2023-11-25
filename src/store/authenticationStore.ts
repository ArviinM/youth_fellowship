import {create} from "zustand";

type AuthenticationStore = {
    isAuthenticated: boolean;
};

export const useAuthenticationStore = create<AuthenticationStore>(() => ({
    isAuthenticated: localStorage.getItem("authenticated") === "true"
}));
