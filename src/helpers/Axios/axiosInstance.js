import axios from "axios";
import { getFromLocalStorage } from "../local-storage";
import { localDBKey } from "@/constants/localDBKey";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const accessToken = getFromLocalStorage(localDBKey.token);
    if (accessToken) config.headers.Authorization = `${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { instance };
