import axios from "axios";
import { getFromLocalStorage, setToLocalStorage } from "../local-storage";
import { localDBKey } from "@/constants/localDBKey";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

const handleTokenUpdate = (headers) => {
  const newAccessToken =
    headers?.["x-access-token"] || headers?.["X-Access-Token"];

  if (newAccessToken) {
    const formattedToken = newAccessToken.startsWith("Bearer ")
      ? newAccessToken
      : `Bearer ${newAccessToken}`;

    // Update localStorage keys
    setToLocalStorage(localDBKey.token, formattedToken);
    setToLocalStorage(localDBKey.authKey, formattedToken);

    // Update Redux state without importing authSlice (avoids circular dependency with baseApi)
    if (store?.dispatch) {
      store?.dispatch({ type: "auth/setToken", payload: formattedToken });
    }
  }
};

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const accessToken =
      getFromLocalStorage(localDBKey.token) ||
      getFromLocalStorage(localDBKey.authKey);
    if (accessToken) config.headers.Authorization = `${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    handleTokenUpdate(response?.headers);
    return response;
  },
  (error) => {
    handleTokenUpdate(error?.response?.headers);
    return Promise.reject(error);
  }
);

export { instance };
