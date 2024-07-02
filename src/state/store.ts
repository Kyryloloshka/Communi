import { configureStore } from '@reduxjs/toolkit';
import { authReducer, dialogReducer, searchReducer } from './slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
		dialogs: dialogReducer,
  },
});
