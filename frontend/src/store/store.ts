import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import defectSlice from './defectSlice';
import notificationSlice from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    defects: defectSlice,
    notifications: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
