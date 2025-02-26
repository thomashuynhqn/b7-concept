import { createSlice } from "@reduxjs/toolkit";

export interface Loading {
  status: boolean;
}

const initialState: Loading = {
  status: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    openLoading: (state) => {
      state.status = true;
    },
    clearLoading: (state) => {
      state.status = false;
    },
  },
});

export const { openLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
