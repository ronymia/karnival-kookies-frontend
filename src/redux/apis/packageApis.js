import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/packages";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL PACKAGES
    getAllPackages: builder.query({
      query: ({ page, perPage, limit }) => ({
        url: `${URL}`,
        method: "GET",
        params: { page, limit, perPage },
      }),
      providesTags: [TagTypes.packages],
    }),

    // GET PACKAGE BY ID
    getPackageById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.packages],
    }),

    // CREATE PACKAGE
    createPackage: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.packages],
    }),

    // UPDATE PACKAGE
    updatePackage: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [TagTypes.packages],
    }),

    // DELETE PACKAGE
    deletePackage: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.packages],
    }),

    // UPLOAD PACKAGE IMAGES
    uploadPackageImages: builder.mutation({
      query: (payload) => {
        const formData = new FormData();
        payload.forEach((file) => {
          formData.append(`files`, file);
        });

        return {
          url: `${URL}/upload-bulk-images`,
          method: "POST",
          contentType: `multipart/form-data`,
          data: formData,
        };
      },
    }),
  }),
});

export const {
  useGetAllPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useUploadPackageImagesMutation,
} = apis;
