import { createSlice } from "@reduxjs/toolkit";
import { authApis } from "../apis/authApis";
import {
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/helpers/local-storage";
import { localDBKey } from "@/constants/localDBKey";

const initialState = {
  user: null,
  token: null,
  permissions: [],
  isAdmin: false,
  isAuthenticated: false,
  isAuthChecked: false,
};

const clearTokensFromStorage = () => {
  removeFromLocalStorage(localDBKey.token);
  removeFromLocalStorage(localDBKey.authKey);
};

const saveTokenToStorage = (token) => {
  if (!token) return;
  const formattedToken = token.startsWith("Bearer ")
    ? token
    : `Bearer ${token}`;
  setToLocalStorage(localDBKey.token, formattedToken);
  setToLocalStorage(localDBKey.authKey, formattedToken);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      clearTokensFromStorage();
      return initialState;
    },
    setToken: (state, action) => {
      state.token = action.payload || null;
      if (action.payload) {
        state.isAuthenticated = true;
        saveTokenToStorage(action.payload);
      }
    },
    setUser: (state, action) => {
      const user = action.payload?.user;
      state.user = user || null;
      state.token = action.payload?.token || user?.token || state.token;
      state.isAuthenticated = !!user;
      state.isAdmin = user?.role === "admin";
      if (state.token) {
        saveTokenToStorage(state.token);
      }
    },
    setAdmin: (state, action) => {
      state.isAdmin = action.payload?.user?.role === "admin";
    },
  },
  extraReducers: (builder) => {
    // FROM LOGIN
    builder.addMatcher(
      authApis.endpoints.loginUser.matchFulfilled,
      (state, action) => {
        const loggedUser = action.payload?.data;
        state.user = loggedUser?.user || null;
        state.isAdmin =
          loggedUser?.role === "admin" || loggedUser?.user?.role === "admin";
        state.token = loggedUser?.accessToken || null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;

        if (loggedUser?.accessToken) {
          saveTokenToStorage(loggedUser.accessToken);
        }
      }
    );

    // FROM GET ACCESS TOKEN (WHEN REFRESHING TOKEN)
    builder.addMatcher(
      authApis.endpoints.getAccessToken.matchFulfilled,
      (state, action) => {
        const verifiedUser = action.payload?.data;
        state.user = verifiedUser || null;
        state.isAdmin = verifiedUser?.role === "admin";
        state.token = verifiedUser?.accessToken || state.token;
        state.isAuthenticated = true;
        state.isAuthChecked = true;

        if (verifiedUser?.accessToken) {
          saveTokenToStorage(verifiedUser.accessToken);
        }
      }
    );

    // LOGOUT AND CLEAR STATE
    builder.addMatcher(
      authApis.endpoints.logOutUser.matchFulfilled,
      () => {
        clearTokensFromStorage();
        return initialState;
      }
    );
  },
});

export const { logout, setToken, setAdmin, setUser } = authSlice.actions;

export default authSlice.reducer;
