import { configureStore } from '@reduxjs/toolkit';
import { baseAPI } from './api/base';
import authReducer from './slices/authSlice';
import { setCredentials } from './slices/authSlice';

export const setupStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      [baseAPI.reducerPath]: baseAPI.reducer,
      auth: authReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(baseAPI.middleware),
  });
};

export { useLoginMutation } from './api/authAPI';
export { setCredentials };
