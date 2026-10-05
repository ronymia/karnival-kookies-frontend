import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/meta-data";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL META DATA
    getAllMetaData: builder.query({
      query: ({ page, perPage, limit }) => ({
        url: `${URL}`,
        method: "GET",
        params: { page, limit, perPage },
      }),
      providesTags: [TagTypes.metaData],
    }),

    // GET META DATA BY ID
    getMetaDataById: builder.query({
      query: ({ id }) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.metaData],
      keepUnusedDataFor: 0,
    }),

    // CREATE META DATA
    createMetaData: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.metaData],
    }),

    // UPDATE META DATA
    updateMetaData: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [TagTypes.metaData],
    }),

    // DELETE META DATA
    deleteMetaData: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${Array.isArray(payload) ? payload.join(",") : payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.metaData],
    }),
  }),
});

export const {
  useGetAllMetaDataQuery,
  useCreateMetaDataMutation,
  useGetMetaDataByIdQuery,
  useUpdateMetaDataMutation,
  useDeleteMetaDataMutation,
} = apis;
