import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: '',
      user: null,
      isGuest: false,

      login: (token, user) => {
        setAuthToken(token);
        set({ token, user, isGuest: false });
      },
      setGuest: () => set({ isGuest: true, token: '', user: null }),
      logout: () => {
        setAuthToken('');
        set({ token: '', user: null, isGuest: false });
      },

      isAuthenticated: () => Boolean(get().token),
      canEdit: () => Boolean(get().token) && !get().isGuest,
    }),
    {
      name: 'checkgear-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token);
      },
    }
  )
);
