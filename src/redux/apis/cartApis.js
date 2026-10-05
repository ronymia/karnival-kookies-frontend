import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/carts";

export const apis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD TO CART
    addToCart: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.cart],
    }),

    // UPDATE QUANTITY OF CART PRODUCT IN DATABASE
    updateQuantityOfCartProduct: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [TagTypes.cart],
    }),

    // REMOVE FROM CART
    removeFromCart: builder.mutation({
      query: (payload) => ({
        url: `${URL}/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.cart],
    }),

    // GET CART BY EMAIL
    getCartByEmail: builder.query({
      query: ({ user_id }) => ({
        url: `${URL}/${user_id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.cart],
    }),

    // CART CHECKOUT
    cartCheckout: builder.mutation({
      query: (payload) => ({
        url: `${URL}/checkout`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.cart, TagTypes.orders],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetCartByEmailQuery,
  useUpdateQuantityOfCartProductMutation,
  useCartCheckoutMutation,
} = apis;
