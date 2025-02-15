import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/products";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL PACKAGES
    getAllClientProducts: builder.query({
      query: ({
        page,
        limit,
        category_id,
        fromPrice,
        toPrice,
        sortByNewest,
        HighToLow,
        lowToHigh,
        searchTerm,
      }) => ({
        url: `${URL}`,
        params: {
          page,
          limit,
          category_id,
          fromPrice,
          toPrice,
          sortByNewest,
          HighToLow,
          lowToHigh,
          searchTerm,
        },
      }),
      providesTags: (result) => (result ? [TagTypes.products] : []),
    }),
    // GET ALL PACKAGES
    getAllProducts: builder.query({
      query: (arg = {}) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: (result) => (result ? [TagTypes.products] : []),
      keepUnusedDataFor: 0,
    }),
    getPriceBounds: builder.query({
      query: (arg = {}) => ({
        url: `${URL}/get-price-bounds`,
        method: "GET",
        params: arg,
      }),
      keepUnusedDataFor: 0,
    }),
    // GET PACKAGE BY ID
    getProductsById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      // providesTags: (result) => (result ? [TagTypes.products] : []),
      keepUnusedDataFor: 0,
    }),
    // CREATE PACKAGE
    createProducts: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes.products],
    }),
    // UPDATE PACKAGE
    updateProducts: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: () => [TagTypes.products],
    }),
    // DELETE PACKAGE
    deleteProducts: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [TagTypes.products],
    }),
    // UPLOAD PACKAGE IMAGES
    uploadProductsImages: builder.mutation({
      query: (payload) => {
        const formData = new FormData();
        payload.forEach((file, i) => {
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

export const {
  useGetAllProductsQuery,
  useGetPriceBoundsQuery,
  useGetProductsByIdQuery,
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useUploadProductsImagesMutation,
  useGetAllClientProductsQuery,
} = apis;
