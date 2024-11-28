import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/auth";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${URL}/register`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes?.user],
    }),
  }),
});

export const { useCreateUserMutation } = apis;
