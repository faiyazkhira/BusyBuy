import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./AuthReducer";

export const store = configureStore({
  reducer: {
    authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
