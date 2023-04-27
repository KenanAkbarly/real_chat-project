import { createSlice } from "@reduxjs/toolkit";

export const loadSlice = createSlice({
  name: "loading",
  initialState: {
    value: false,
  },
  reducers: {
    showLoad: (state, action) => {
      state.value = true;
    },
    hideLoad: (state, action) => {
      state.value = false;
    },
  },
});

export const { showLoad, hideLoad } = loadSlice.actions;
