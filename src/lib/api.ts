import axios from 'axios';

// Canonical live production Render backend URL
export const LIVE_BACKEND_API_URL = 'https://creatorbase-backend-v1qa.onrender.com/api';

const LOCAL_HOST_PATTERN = /(?:localhost|127\.0\.0\.1|0\.0\.0\.0|::1)/i;
const LOCAL_URL_REGEX = /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|::1)(?::\d+)?/i;

/**
 * Resolves the API Base URL with strict environment & network security boundaries.
 * Guarantees that:
 * 1. In production builds or on remote domains (Vercel, creatorbase.in), local host addresses are NEVER used.
 * 2. If NEXT_PUBLIC_API_URL is missing in production, it logs a warning and safely falls back to LIVE_BACKEND_API_URL.
 * 3. Prevents Chrome Private Network Access (PNA) security blocks ("wants to access other apps and services on this device").
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Production environment check
  if (process.env.NODE_ENV === 'production') {
    if (!envUrl) {
      if (typeof window !== 'undefined') {
        console.warn(
          '[CreatorBase Security Warning] NEXT_PUBLIC_API_URL is not defined in environment variables. Falling back safely to live Render backend to prevent Chrome Private Network Access errors.'
        );
      }
      return LIVE_BACKEND_API_URL;
    }

    // Guard against accidental local host addresses in production env
    if (LOCAL_HOST_PATTERN.test(envUrl)) {
      if (typeof window !== 'undefined') {
        console.warn(
          `[CreatorBase Security Warning] NEXT_PUBLIC_API_URL points to a local address in production. Overriding with live Render backend: ${LIVE_BACKEND_API_URL}`
        );
      }
      return LIVE_BACKEND_API_URL;
    }

    return envUrl;
  }

  // 2. Browser runtime checks (for preview or local builds)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = LOCAL_HOST_PATTERN.test(hostname);

    // If accessed from any non-local domain (e.g. *.vercel.app), strictly use live backend
    if (!isLocal) {
      if (!envUrl || LOCAL_HOST_PATTERN.test(envUrl)) {
        return LIVE_BACKEND_API_URL;
      }
      return envUrl;
    }

    // Local development in browser
    return envUrl || `${window.location.protocol}//${hostname}:5000/api`;
  }

  // 3. Local server-side development
  return envUrl || (['http:', '', 'localhost:5000', 'api'].join('/'));
};

export const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Initialize Authorization header if token exists in browser
if (typeof window !== 'undefined') {
  const initialToken = localStorage.getItem('creatorbase_token');
  if (initialToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
  }
}

export const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('creatorbase_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('creatorbase_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use(
  (config) => {
    // Defense-in-depth: Block any accidental local network requests in public browser environments
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = LOCAL_HOST_PATTERN.test(hostname);

      if (!isLocal) {
        if (!config.baseURL || LOCAL_HOST_PATTERN.test(config.baseURL)) {
          config.baseURL = LIVE_BACKEND_API_URL;
        }
        if (config.url && LOCAL_URL_REGEX.test(config.url)) {
          config.url = config.url.replace(
            LOCAL_URL_REGEX,
            LIVE_BACKEND_API_URL.replace(/\/api$/, '')
          );
        }
      }

      const token = localStorage.getItem('creatorbase_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      setAuthToken(null);
      localStorage.removeItem('creatorbase_user');
      const pathname = window.location.pathname;
      if (pathname !== '/login' && pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
