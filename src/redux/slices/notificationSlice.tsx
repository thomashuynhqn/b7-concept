// NotificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for a single notification
export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// Define the interface for the slice state
export interface NotificationsState {
  notifications: Notification[];
}

// Initial state
const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

// Export actions
export const { addNotification, removeNotification } =
  notificationsSlice.actions;

// Export reducer
export default notificationsSlice.reducer;
