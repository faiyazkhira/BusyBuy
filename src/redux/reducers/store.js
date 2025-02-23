import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./AuthReducer";
import { cartReducer } from "./CartReducer";

export const store = configureStore({
  reducer: {
    authReducer,
    cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
