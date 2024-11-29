const { createSlice } = require("@reduxjs/toolkit");
const { authApis } = require("../apis/authApis");

const initialState = {
  user: null,
  token: null,
  permissions: [],
  isAdmin: null,
  isAuthenticated: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: { logout: () => initialState },
  extraReducers: (builder) => {
    // FROM LOGIN
    builder.addMatcher(
      authApis.endpoints.loginUser.matchFulfilled,
      (state, action) => {
        //
        state.user = action.payload?.data?.user;
        state.isAdmin = action.payload?.data?.user?.role === "admin";
        state.token = action.payload?.data?.accessToken;
        state.isAuthenticated = true;
        window.localStorage.setItem(
          "accessToken",
          `Bearer ${action.payload?.data?.accessToken}`
        );
      }
    );

    // FROM GET USER WHEN RELOAD PAGE
    builder.addMatcher(
      authApis.endpoints.getUser.matchFulfilled,
      (state, action) => {
        console.log({ getUser: action.payload });
        state.user = action.payload?.user;
        state.isAdmin = action.payload?.user?.role === "admin";
        state.token = action.payload?.user?.token;
        state.isAuthenticated = true;
        window.localStorage.setItem(
          "accessToken",
          `Bearer ${action.payload?.user?.token}`
        );
      }
    );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
