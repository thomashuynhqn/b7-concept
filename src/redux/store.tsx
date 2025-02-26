import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";
import messageReducer from "./slices/messageSlice";
import notificationsReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    loading: loadingReducer,
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
