import { baseApi } from "../baseAPi";

// BASE URL
const URL = "/v1.0/favorite-products";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD TO FAVORITE LIST
    addToFavorite: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
    }),
    // REMOVE FROM
    removeFromFavorite: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "DELETE",
        data: payload,
      }),
    }),
  }),
});

export const { useAddToFavoriteMutation, useRemoveFromFavoriteMutation } = apis;
