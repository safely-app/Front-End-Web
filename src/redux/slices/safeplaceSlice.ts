import { createSlice } from "@reduxjs/toolkit";
import ISafeplace from "../../components/interfaces/ISafeplace";

interface SafeplaceState {
  date: number;
  safeplaces: ISafeplace[];
}

const initialState: SafeplaceState = {
  date: 0,
  safeplaces: []
};

export const safeplaceSlice = createSlice({
  name: 'safeplace',
  initialState: initialState,
  reducers: {
    setReduxSafeplaces: (state, action) => {
      state.date = action.payload.date;
      state.safeplaces = action.payload.safeplaces;
    }
  }
});

export const {
  setReduxSafeplaces,
} = safeplaceSlice.actions;

export default safeplaceSlice.reducer;