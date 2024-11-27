import { TagTypes } from "../tagTypes";

const { baseApi } = require("./baseAPi");

const USER_URL = "/users";

export const userApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL USERS
    getAllUsers: builder.query({
      query: ({ page, perPage, limit }) => ({
        url: `${USER_URL}/all`,
        method: "GET",
        params: { page, limit, perPage },
      }),
      providesTags: (result) => (result ? [TagTypes.user] : []),
    }),
    // UPDATE USER
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `${USER_URL}/${payload?.email}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserMutation } = userApis;
