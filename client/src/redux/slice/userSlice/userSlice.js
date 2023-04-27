import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "users",
  initialState: {
    value: JSON.parse(localStorage.getItem("token")) || null,
    post: [],
  },
  reducers: {
    SetUser: (state, action) => {
      return { ...state, value: action.payload };
    },
    setPost: (state, action) => {
      state.post.push(action.payload);
    },
  },
});

export const { SetUser, setPost } = userSlice.actions;
