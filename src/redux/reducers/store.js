import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./AuthReducer";
import { cartReducer } from "./CartReducer";
import { notificationReducer } from "./NotificationReducer";

export const store = configureStore({
  reducer: {
    authReducer,
    cartReducer,
    notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
