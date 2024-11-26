import axios from "axios";
import { getFromLocalStorage } from "../local-storage";
import { localDBKey } from "@/constatnts/localDBKey";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// add request interceptor
instance.interceptors.request.use(
  // request config
  function (config) {
    const accessToken = getFromLocalStorage(localDBKey.authKey);
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  // request error
  function (error) {
    return Promise.reject(error);
  }
);

// add response interceptor
instance.interceptors.response.use(
  // @ts-ignore
  function (response) {
    const responseObject = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  // response error
  async function (error) {
    // const responseObject = {
    //   statusCode: error?.response?.data?.statusCode || 500,
    //   message: error?.response?.data?.message || "Something went wrong",
    //   errorMessages: error?.response?.data?.message,
    // };
    // return responseObject;
    return Promise.reject(error);
  }
);

export { instance };
