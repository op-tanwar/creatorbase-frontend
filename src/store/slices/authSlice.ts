import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { setAuthToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('creatorbase_token');
      const userStr = localStorage.getItem('creatorbase_user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (token && user) {
        return {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        };
      }
    } catch {
      // Fallback to default
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      setAuthToken(action.payload.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('creatorbase_user', JSON.stringify(action.payload.user));
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('creatorbase_user', JSON.stringify(action.payload));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('creatorbase_user');
      }
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
