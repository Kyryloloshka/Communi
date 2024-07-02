import { ChatType, SelectedChatData, User } from '@/types/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface DialogState {
  groupInfoOpen: boolean;
}

const initialState: DialogState = {
	groupInfoOpen: false,
};

const slice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
		setGroupInfoOpen: (state, action: PayloadAction<boolean>) => {
			state.groupInfoOpen = action.payload;
		}
	}
});

export const { reducer: dialogReducer, actions: dialogActions } = slice;
