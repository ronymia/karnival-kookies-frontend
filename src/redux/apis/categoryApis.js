import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/categories";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CATEGORY
    getAllCategories: builder.query({
      query: ({ page, perPage, limit }) => ({
        url: `${URL}`,
        method: "GET",
        params: { page, limit, perPage },
      }),
      providesTags: (result) => (result ? [TagTypes.categories] : []),
      keepUnusedDataFor: 0,
    }),
    // GET CATEGORY BY ID
    getCategoryById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      // providesTags: (result) => (result ? [TagTypes.categories] : []),
      keepUnusedDataFor: 0,
    }),
    // CREATE CATEGORY
    createCategory: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes.categories],
    }),
    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes.categories],
    }),
    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [TagTypes.categories],
    }),
    // UPLOAD CATEGORY IMAGES
    uploadCategoryImages: builder.mutation({
      query: (payload) => {
        const formData = new FormData();
        payload.forEach((file) => {
          formData.append(`files`, file);
        });

        return {
          url: `${URL}/upload-bulk-files`,
          method: "POST",
          contentType: `multipart/form-data`,
          data: formData,
        };
      },
    }),
  }),
});

export const { useGetAllCategoriesQuery } = apis;
