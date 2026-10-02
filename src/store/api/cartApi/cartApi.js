import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CART_PATH } from "./path";
import { useSyncExternalStore } from "react";
import { createCartQuantityQueue } from "@/lib/cartQuantityQueue";

const queueQuantityUpdate = createCartQuantityQueue();
const quantityChanges = new Map();
let quantityRevision = 0;

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      queryFn: async (_arg, _api, _options, baseQuery) => {
        const token = localStorage.getItem("token");
        const readRevision = quantityRevision;
        const result = await baseQuery(CART_PATH.GET_MY_CART);
        for (const item of result.data?.data?.items || []) {
          const key = `${token}:${item.product?._id}`;
          const change = quantityChanges.get(key);
          if (!change) continue;
          // A read started before a click must not replace that click with old data.
          if (!change.failed && (change.pending || change.revision > readRevision)) {
            item.quantity = change.quantity;
          }
        }
        if (result.data) {
          for (const [key, change] of quantityChanges) {
            if (key.startsWith(`${token}:`) && !change.pending && change.revision <= readRevision) {
              quantityChanges.delete(key);
            }
          }
        }
        return result;
      },
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
      queryFn: ({ productId, quantity }, _api, _options, baseQuery) => {
        const token = localStorage.getItem("token");
        return queueQuantityUpdate(`${token}:${productId}`, () => {
          // Do not send an old account's queued write using a new account's token.
          if (localStorage.getItem("token") !== token) {
            return { error: { status: "CUSTOM_ERROR", error: "Hisob o‘zgardi" } };
          }
          return baseQuery({
            url: CART_PATH.UPDATE_ITEM(productId),
            method: "PATCH",
            body: { quantity },
          });
        });
      },
      onQueryStarted: async ({ productId, quantity }, { dispatch, queryFulfilled }) => {
        const key = `${localStorage.getItem("token")}:${productId}`;
        const change = { quantity, pending: true, failed: false, revision: ++quantityRevision };
        quantityChanges.set(key, change);
        dispatch(cartApi.util.updateQueryData("getMyCart", undefined, (response) => {
          const item = response.data?.items?.find((entry) => entry.product?._id === productId);
          if (item) item.quantity = quantity;
        }));
        try {
          await queryFulfilled;
        } catch {
          change.failed = true;
        } finally {
          change.pending = false;
          change.revision = ++quantityRevision;
        }
      },
      // RTK Query's delayed invalidation refreshes the cart after all queued
      // mutations settle, including failures. Older replies cannot undo newer clicks.
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

export function useIsCartQuantityPending() {
  // The queue survives route changes, unlike a component's mutation result.
  return useSyncExternalStore(queueQuantityUpdate.subscribe, queueQuantityUpdate.getSnapshot);
}
