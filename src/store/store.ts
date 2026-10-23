import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import filterReducer from './slices/filterSlice';
import shortlistReducer from './slices/shortlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filterReducer,
    shortlists: shortlistReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
