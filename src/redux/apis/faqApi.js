import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/faqs";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL FAQ
    getFaqs: builder.query({
      query: (arg) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.faqs],
    }),

    // CREATE FAQ
    createFaq: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.faqs],
    }),

    // UPDATE FAQ
    updateFaq: builder.mutation({
      query: (payload) => ({
        url: `${URL}/`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [TagTypes.faqs],
    }),

    // DELETE FAQ
    deleteFaq: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.faqs],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = apis;
