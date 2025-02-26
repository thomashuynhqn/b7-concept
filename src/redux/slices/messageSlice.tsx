import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  type: string;
  content: string;
}

const initialState: Message = {
  type: "success",
  content: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<Message>) => {
      state.type = action.payload.type;
      state.content = action.payload.content;
    },
  },
});

export const { showMessage } = messageSlice.actions;
export default messageSlice.reducer;
