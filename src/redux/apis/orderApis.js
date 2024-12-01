import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/orders";

export const orderApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ORDERS
    getAllOrders: builder.query({
      query: ({ status, start_date, end_date, page, limit }) => ({
        url: `${URL}`,
        params: { status, start_date, end_date, page, limit },
      }),
      providesTags: (result) => (result ? [TagTypes.orders] : []),
    }),
    // UPDATE ORDER STATUS
    orderStatusChange: builder.mutation({
      query: (payload) => ({
        url: `${URL}/change-status/${payload?.id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes.orders],
    }),
  }),
});

export const { useOrderStatusChangeMutation, useGetAllOrdersQuery } = orderApis;
