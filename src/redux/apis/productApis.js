import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/products";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CLIENT PRODUCTS
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
      providesTags: [TagTypes.products],
    }),

    // GET ALL PRODUCTS
    getAllProducts: builder.query({
      query: (arg = {}) => ({
        url: `${URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.products],
    }),

    // GET PRICE BOUNDS OF PRODUCTS
    getPriceBounds: builder.query({
      query: (arg = {}) => ({
        url: `${URL}/get-price-bounds`,
        method: "GET",
        params: arg,
      }),
      providesTags: [TagTypes.products],
    }),

    // GET PRODUCT BY ID
    getProductsById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.products],
    }),

    // CREATE PRODUCT
    createProducts: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.products],
    }),

    // UPDATE PRODUCT
    updateProducts: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [TagTypes.products],
    }),

    // DELETE PRODUCT
    deleteProducts: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.products],
    }),

    // UPLOAD PRODUCT IMAGES
    uploadProductsImages: builder.mutation({
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
