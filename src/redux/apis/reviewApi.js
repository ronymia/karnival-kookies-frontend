import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/reviews";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL REVIEW
    getReviews: builder.query({
      query: (arg) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.reviews],
    }),

    // GET REVIEW BY ID
    getReviewById: builder.query({
      query: (arg) => ({
        url: `${URL}/${arg?.id}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.reviews],
    }),

    // CREATE REVIEW
    createReview: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.reviews],
    }),

    // UPDATE REVIEW
    updateReview: builder.mutation({
      query: (payload) => ({
        url: `${URL}/`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [TagTypes.reviews],
    }),

    // DELETE REVIEW
    deleteReview: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.reviews],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = apis;
