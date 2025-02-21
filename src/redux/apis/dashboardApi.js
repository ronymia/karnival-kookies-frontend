import { baseApi } from "../baseAPi";

// BASE URL
const URL = "/v1.0/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // PAYMENT CONFIG
    getDashboardData: builder.query({
      query: () => ({
        url: `${URL}`,
      }),
    }),
    // PAYMENT INTENT
    getCustomerDashboardData: builder.query({
      query: ({ user_id }) => ({
        url: `${URL}/${user_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCustomerDashboardDataQuery, useGetDashboardDataQuery } =
  dashboardApi;
