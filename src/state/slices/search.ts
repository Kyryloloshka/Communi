import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";

interface SearchState {
  searchKey: string;
  searchResults: DocumentData[];
}

const initialState: SearchState = {
  searchKey: "",
  searchResults: [],
};

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchKey: (state, action: PayloadAction<string>) => {
      state.searchKey = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<DocumentData[]>) => {
      state.searchResults = action.payload;
    }
  },
});

export const {reducer: searchReducer, actions: searchActions } = slice;