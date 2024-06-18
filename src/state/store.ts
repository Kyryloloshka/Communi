import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});