import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCookie } from "cookies-next";
import { AppConstants } from "@/constants";
import { User } from "@/logic/interfaces";

interface InitialState {
  loading: boolean;
  currentUser: User | null;
}

const initialState: InitialState = {
  loading: false,
  currentUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder;
    // .addCase(getCurrentUserAction.fulfilled, (state, action) => {
    //     const { status, data } = action.payload;
    //     if (status === 401 || status === 400) {
    //         state.accessToken = null;
    //         state.error = data.detail;
    //     } else {
    //         state.accessToken = data.access;
    //         state.error = null;
    //     }
    // })
  },
});
const authActions = authSlice.actions;
export { authActions };

export const selectIsLoading = (state: RootState) => state.AuthReducer.loading;

export const selectCurrentUser = (state: RootState) =>
  state.AuthReducer.currentUser;

export default authSlice.reducer;
