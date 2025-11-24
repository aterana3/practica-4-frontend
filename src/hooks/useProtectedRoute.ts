"use client"

import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useAuthStore} from '@/store/auth.store';

export function useProtectedRoute() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!token || !user) {
            router.push('/signIn');
        }
    }, [token, user, router]);

    return {isAuthenticated: !!(token && user)};
}