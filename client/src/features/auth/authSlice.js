import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

const AUTH_STORAGE_KEY = "prompthive_auth_user";

function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // no-op
  }
}

const persistedUser = loadPersistedUser();

const initialState = {
  user: persistedUser,
  isAuthenticated: Boolean(persistedUser),
  status: persistedUser ? "authenticated" : "idle",
  error: null,
};

export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || "Unable to restore session");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await authService.login(payload);
    return res.data.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await authService.register(payload);
    return res.data.data.user;
  } catch (error) {
    return rejectWithValue({
      message: error.response?.data?.error?.message || "Registration failed",
      code: error.response?.data?.error?.code,
      details: error.response?.data?.error?.details || [],
      status: error.response?.status,
    });
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "authenticated";
          state.user = action.payload;
          state.isAuthenticated = true;
          persistUser(action.payload);
        } else {
          state.status = "unauthenticated";
          state.user = null;
          state.isAuthenticated = false;
          persistUser(null);
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "unauthenticated";
        state.user = null;
        state.isAuthenticated = false;
        persistUser(null);
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.isAuthenticated = true;
        persistUser(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.isAuthenticated = true;
        persistUser(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "unauthenticated";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        persistUser(null);
      });
  },
});

export default authSlice.reducer;
