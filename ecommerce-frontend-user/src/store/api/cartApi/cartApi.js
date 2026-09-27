import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CART_PATH } from "./path";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => CART_PATH.GET_MY_CART,
      providesTags: [API_TAGS.CART],
    }),
    addItem: builder.mutation({
      query: (body) => ({
        url: CART_PATH.ADD_ITEM,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.CART],
    }),
    updateItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: CART_PATH.UPDATE_ITEM(productId),
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: [API_TAGS.CART],
    }),
    removeItem: builder.mutation({
      query: (productId) => ({
        url: CART_PATH.REMOVE_ITEM(productId),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CART],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: CART_PATH.CLEAR,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CART],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi;