const { createSlice } = require("@reduxjs/toolkit");
const { authApis } = require("../apis/authApis");

const initialState = {
  user: null,
  token: null,
  permissions: [],
  isAdmin: null,
  isAuthenticated: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload?.user;
      state.token = action.payload?.user?.token;
      state.isAuthenticated = true; // Ensure this is set
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
        //
        state.user = loggedUser?.user;
        state.isAdmin = loggedUser?.role === "admin";
        state.token = loggedUser?.accessToken;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        window.localStorage.setItem(
          "token",
          `Bearer ${loggedUser?.accessToken}`
        );
      }
    );

    // FROM GET USER WHEN RELOAD PAGE
    builder.addMatcher(
      authApis.endpoints.getUserByToken.matchFulfilled,
      (state, action) => {
        //
        const verifiedUser = action.payload?.data;
        //
        state.user = verifiedUser;
        state.isAdmin = verifiedUser?.role === "admin";
        // state.token = verifiedUser?.token;
        state.isAuthenticated = true; // Ensure this is set
      }
    );

    // FROM GET USER WHEN GER NEW ACCESS TOKEN
    builder.addMatcher(
      authApis.endpoints.getAccessToken.matchFulfilled,
      (state, action) => {
        //
        const verifiedUser = action.payload?.data;
        //
        state.user = verifiedUser;
        state.isAdmin = verifiedUser?.role === "admin";
        // state.token = verifiedUser?.token;
        state.isAuthenticated = true; // Ensure this is set
        window.localStorage.setItem(
          "token",
          `Bearer ${verifiedUser?.accessToken}`
        );
      }
    );

    // LOGOUT AND CLEAR STATE
    builder.addMatcher(
      authApis.endpoints.logOutUser.matchFulfilled,
      (state) => {
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.isAdmin = null;
        state.isAuthenticated = null;
        window.localStorage.clear();
      }
    );
  },
});

export const { logout, setAdmin, setUser } = authSlice.actions;

export default authSlice.reducer;
