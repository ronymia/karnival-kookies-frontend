import { TagTypes } from "../tagTypes";

const { baseApi } = require("./baseAPi");

const AUTH_URL = "/auth";

export const authApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
  }),
});

export const { useCreateUserMutation } = authApis;
