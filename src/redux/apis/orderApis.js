import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/orders";

export const orderApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ORDERS
    getAllOrders: builder.query({
      query: ({ status, start_date, end_date, page, limit, searchTerm }) => ({
        url: `${URL}`,
        params: { status, start_date, end_date, page, limit, searchTerm },
      }),
      providesTags: [TagTypes.orders],
    }),

    // GET ORDERS BY USER ID
    getOrderByUserId: builder.query({
      query: ({ status, start_date, end_date, page, limit, user_id }) => ({
        url: `${URL}/${user_id}`,
        params: { status, start_date, end_date, page, limit },
      }),
      providesTags: [TagTypes.orders],
    }),

    // UPDATE ORDER STATUS
    orderStatusChange: builder.mutation({
      query: (payload) => ({
        url: `${URL}/change-status/${payload?.id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [TagTypes.orders],
    }),

    // ORDER CHECK IN
    orderCheckIn: builder.mutation({
      query: (payload) => ({
        url: `${URL}/check-in`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.orders],
    }),
  }),
});

export const {
  useOrderStatusChangeMutation,
  useGetAllOrdersQuery,
  useGetOrderByUserIdQuery,
  useOrderCheckInMutation,
} = orderApis;
