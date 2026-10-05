import { baseApi } from "../baseAPi";

// BASE URL
const URL = "/v1.0/payments";

export const paymentApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // PAYMENT CONFIG (GET STRIPE PUBLISHABLE KEY)
    paymentConfig: builder.query({
      query: () => ({
        url: `/v1.0/stripe/config`,
      }),
    }),

    // CREATE PAYMENT INTENT (STANDALONE)
    createPaymentIntent: builder.mutation({
      query: (payload) => ({
        url: `${URL}/create-payment-intent`,
        method: "POST",
        data: payload,
      }),
    }),

    // PROCEED PAYMENT (CREATES PENDING ORDER + PAYMENT INTENT)
    proceedPayment: builder.mutation({
      query: (payload) => ({
        url: `${URL}/proceed`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useProceedPaymentMutation,
  usePaymentConfigQuery,
  useLazyPaymentConfigQuery,
} = paymentApis;
