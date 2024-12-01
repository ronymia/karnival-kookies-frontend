import { baseApi } from "../baseAPi";

// BASE URL
const URL = "/payments";

export const paymentApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // PAYMENT CONFIG
    paymentConfig: builder.query({
      query: () => ({
        url: `${URL}/config`,
      }),
    }),
    // PAYMENT INTENT
    createPaymentIntent: builder.mutation({
      query: (payload) => ({
        url: `${URL}/create-payment-intent`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  usePaymentConfigQuery,
  useLazyPaymentConfigQuery,
} = paymentApis;
