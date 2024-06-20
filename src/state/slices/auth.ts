import { SelectedChatData, User } from '@/types/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  myUser: User | null;
  selectedChat: SelectedChatData | null;
}

const initialState: AuthState = {
  myUser: null,
  selectedChat: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMyUser: (state, action: PayloadAction<User | null>) => {
      state.myUser = action.payload;
    },
    setSelectedChat: (
      state,
      action: PayloadAction<SelectedChatData | null>,
    ) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { reducer: authReducer, actions: authActions } = slice;
