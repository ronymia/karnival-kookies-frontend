import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/auth";

export const authApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET USER
    getUser: builder.query({
      query: () => ({
        url: `${URL}/user/info`,
      }),
    }),
    getUserByToken: builder.query({
      query: () => ({
        url: `${URL}/user-by-token`,
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
    // LOGOUT
    logOutUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/logout`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
    // VERIFY USER EMAIL
    verifyUserEmail: builder.mutation({
      query: (payload) => ({
        url: `${URL}/verify-user-email`,
        method: "PUT",
        data: payload,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useLogOutUserMutation,
  useVerifyUserEmailMutation,
  useLazyGetUserByTokenQuery,
} = authApis;
