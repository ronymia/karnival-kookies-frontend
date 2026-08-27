import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { persistReducer, persistStore } from "redux-persist";

import { baseApi } from "./baseAPi";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import { injectStore } from "@/helpers/axios/axiosInstance";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Separate persist configs for auth & cart
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated", "permissions"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["selectedItems", "totalQuantity", "totalPrice"],
};

// Persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

// Inject store instance into axios interceptor for real-time auth sync
injectStore(store);

// Persistor for persisting state
export const persistor = persistStore(store);

// Enable automatic refetching for queries
setupListeners(store.dispatch);

export default store;
