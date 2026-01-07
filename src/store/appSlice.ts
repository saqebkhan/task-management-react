import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCurrentUser } from "./appThunks";

/* =======================
   Types
======================= */

export interface Toast {
  isVisible: boolean;
  message?: string;
  type?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  toast: Toast;
  error: string | null;
  authChecked: boolean; // ✅ NEW
}

/* =======================
   Initial State
======================= */

const initialState: AppState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  toast: { isVisible: false },
  error: null,
  authChecked: false,
};

/* =======================
   Slice
======================= */

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /* Loading */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /* Auth */
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.authChecked = action.payload;
    },  

    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    /* Toast */
    showToast: (
      state,
      action: PayloadAction<Omit<Toast, "isVisible">>
    ) => {
      state.toast = {
        isVisible: true,
        ...action.payload,
      };
    },

    hideToast: (state) => {
      state.toast = { isVisible: false };
    },

    /* Error */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    /* Logout */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },

  /* =======================
     Thunks
  ======================= */

  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

/* =======================
   Exports
======================= */

export const {
  setLoading,
  setAuthUser,
  setAuthenticated,
  setUser,
  showToast,
  hideToast,
  setError,
  clearError,
  logout,
  setAuthChecked
} = appSlice.actions;

export default appSlice.reducer;
