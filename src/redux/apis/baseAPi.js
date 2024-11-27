import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/helpers/Axios/axiosBaseQuery";
import { tagTypesList } from "../tagTypes";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
