import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/categories";

export const categoryApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CATEGORY
    getAllCategories: builder.query({
      query: (arg) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.categories],
    }),

    // GET CATEGORY BY ID
    getCategoryById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.categories],
    }),

    // CREATE CATEGORY
    createCategory: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.categories],
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [TagTypes.categories],
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.categories],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
} = categoryApis;
