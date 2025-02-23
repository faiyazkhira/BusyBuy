// notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    show: (_, action) => action.payload,
    hide: () => null,
  },
});

export const { show, hide } = notificationSlice.actions;

export const displayNotification =
  (message, type = "error") =>
  (dispatch) => {
    console.log("Dispatching notification:", message, type);
    dispatch(show({ message, type }));
    setTimeout(() => dispatch(hide()), 2000);
  };

export const notificationReducer = notificationSlice.reducer;
