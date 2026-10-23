'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setLoading, logout } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { Toaster } from 'sonner';

import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Sparkles, Loader2 } from 'lucide-react';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initAuth = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('creatorbase_token');
      const userStr = localStorage.getItem('creatorbase_user');

      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      // Synchronously hydrate cached profile on client mount to eliminate delays
      if (userStr) {
        try {
          const cachedUser = JSON.parse(userStr);
          if (cachedUser && cachedUser.id) {
            dispatch(setUser(cachedUser));
          }
        } catch {
          // Continue to API check
        }
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success && response.data.data) {
          dispatch(setUser(response.data.data));
        } else {
          dispatch(logout());
        }
      } catch (err: any) {
        // Only log out if specifically 401 unauthorized
        if (err.response?.status === 401) {
          dispatch(logout());
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute =
    pathname.startsWith('/discover') ||
    pathname.startsWith('/shortlists') ||
    pathname.startsWith('/campaigns');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && isProtectedRoute) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthRoute) {
      router.replace('/discover');
    }
  }, [isAuthenticated, isLoading, pathname, router, isProtectedRoute, isAuthRoute]);

  // If loading session on a protected route, display a sleek theme-matched loading view
  if (mounted && isLoading && isProtectedRoute) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 shadow-xl shadow-emerald-950 animate-pulse">
          <Sparkles className="w-6 h-6 text-emerald-200" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Connecting CreatorBase workspace...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </AuthInitializer>
    </Provider>
  );
}
