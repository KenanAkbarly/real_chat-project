import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/userSlice/userSlice";
import { loadSlice } from "./slice/loadingSlice/loadSlice";

export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
    loading: loadSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ immutableCheck: false }),
  ],
});
