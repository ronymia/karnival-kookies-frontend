import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/coupons";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL COUPON CODES
    getCouponCodes: builder.query({
      query: (arg) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.couponCode],
    }),

    // CREATE COUPON CODE
    createCouponCode: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.couponCode],
    }),

    // UPDATE COUPON CODE
    updateCouponCode: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [TagTypes.couponCode],
    }),

    // DELETE COUPON CODE
    deleteCouponCode: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.couponCode],
    }),
  }),
});

export const {
  useGetCouponCodesQuery,
  useCreateCouponCodeMutation,
  useUpdateCouponCodeMutation,
  useDeleteCouponCodeMutation,
} = apis;
