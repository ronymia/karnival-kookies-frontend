import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/auth";

export const authApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET USER
    getUser: builder.query({
      query: () => ({
        url: `${URL}/user/info`,
      }),
    }),
    // REGISTER
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/register`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),

    // LOGIN USER
    loginUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/login`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
    logOutUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/logout`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
  }),
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useLogOutUserMutation,
} = authApis;
