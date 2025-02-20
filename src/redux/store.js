import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import { baseApi } from "./baseAPi";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";

// Separate persist configs for auth & cart
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated", "permissions"], // Persist only user-related data, adjust as needed
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["selectedItems", "totalQuantity", "totalPrice"], // Persist only necessary cart data
};

// Persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    [baseApi.reducerPath]: baseApi.reducer, // No need to persist this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }).concat(baseApi.middleware),
});

// Persistor for persisting state
export const persistor = persistStore(store);

// Enable automatic refetching for queries
setupListeners(store.dispatch);

export default store;
