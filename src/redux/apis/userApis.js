import { TagTypes } from "../tagTypes";
import { baseApi } from "./baseAPi";

// BASE URL
const URL = "/users";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL USERS
    getAllUsers: builder.query({
      query: ({ page, perPage, limit }) => ({
        url: `${URL}/all`,
        method: "GET",
        params: { page, limit, perPage },
      }),
      providesTags: (result) => (result ? [TagTypes.user] : []),
    }),
    // UPDATE USER
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${payload?.email}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserMutation } = apis;
