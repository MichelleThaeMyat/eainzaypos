import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('userInfo');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  login: (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
}));
