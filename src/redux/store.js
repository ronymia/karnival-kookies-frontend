import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import { baseApi } from "./baseAPi";
import authReducer from "./features/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["token"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export const persistor = persistStore(store);

// OPTIONAL
setupListeners(store.dispatch);

export default store;
