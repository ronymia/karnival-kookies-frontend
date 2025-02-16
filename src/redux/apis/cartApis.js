import { baseApi } from "../baseAPi";

// BASE URL
const URL = "/v1.0/carts";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD TO FAVORITE LIST
    addToCart: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
    }),
    // REMOVE FROM
    removeFromCart: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "DELETE",
        data: payload,
      }),
    }),
    // GET CART BY EMAIL
    getCartByEmail: builder.query({
      query: ({ email }) => ({
        url: `${URL}/${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetCartByEmailQuery,
} = apis;
