import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (msg) => useUIStore.getState().addToast(msg, 'success'),
  error: (msg) => useUIStore.getState().addToast(msg, 'error'),
  info: (msg) => useUIStore.getState().addToast(msg, 'info'),
};
