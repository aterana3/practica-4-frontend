import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { client } from '@/lib/client';

interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null }),
            login: async (credentials) => {
                const response = await client.post('/security/auth/login', credentials);
                const { token, user } = response.data;
                set({ token: token || response.data.accessToken, user: user || response.data.user });
            },
            register: async (data) => {
                await client.post('/security/auth/register', data);
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
