import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
