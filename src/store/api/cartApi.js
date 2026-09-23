import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";

export const cartApi = baseApi.injectEndpoints({
endpoints: (builder) => ({
getMyCart: builder.query({
query: () => "/cart/get-my-cart",
providesTags: [API_TAGS.CART],
}),

addCartItem: builder.mutation({
  query: (body) => ({
    url: "/cart/add-item",
    method: "POST",
    body,
  }),
  invalidatesTags: [API_TAGS.CART],
}),

updateCartItem: builder.mutation({
  query: ({ productId, quantity }) => ({
    url: `/cart/update-item/${productId}`,
    method: "PATCH",
    body: {
      quantity,
    },
  }),
  invalidatesTags: [API_TAGS.CART],
}),

removeCartItem: builder.mutation({
  query: (productId) => ({
    url: `/cart/remove-item/${productId}`,
    method: "DELETE",
  }),
  invalidatesTags: [API_TAGS.CART],
}),

clearCart: builder.mutation({
  query: () => ({
    url: "/cart/clear",
    method: "DELETE",
  }),
  invalidatesTags: [API_TAGS.CART],
}),

}),
});

export const {
useGetMyCartQuery,
useAddCartItemMutation,
useUpdateCartItemMutation,
useRemoveCartItemMutation,
useClearCartMutation,
} = cartApi;