import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/users";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL USERS
    getAllUsers: builder.query({
      query: (arg) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.user],
    }),
    // CREATE USER
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.user],
    }),
    // UPDATE USER
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${payload?.id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [TagTypes.user],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} = apis;
