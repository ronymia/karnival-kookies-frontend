import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/subscribers";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // UPDATE USER
    subscriptionForNewsletter: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const { useSubscriptionForNewsletterMutation } = apis;
