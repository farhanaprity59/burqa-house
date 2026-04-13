import { create } from 'zustand';
import { api, type UserData } from '@/lib/api';

interface AuthStore {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: false,

  isAuthenticated: () => !!get().token && !!get().user,
  isAdmin: () => get().user?.role === 'admin',

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.login({ email, password });
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.register(data);
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {
      // Token may already be invalid, proceed with cleanup
    } finally {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null });
    }
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await api.getUser();
      set({ user: res.data, isLoading: false });
    } catch {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null });
  },
}));
