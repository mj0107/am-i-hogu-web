import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
};

type AuthActions = {
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAccessToken: () => set({ accessToken: null }),
}));
