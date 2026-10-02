import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { ORDER_PATH } from "./path";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: ORDER_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.ORDER, API_TAGS.CART, API_TAGS.PRODUCT],
    }),
    getMyOrders: builder.query({
      query: (params) => ({ url: ORDER_PATH.GET_ALL_ME, params }),
      providesTags: [API_TAGS.ORDER],
    }),
    getSingleOrder: builder.query({
      query: (id) => ORDER_PATH.GET_SINGLE(id),
      providesTags: (result, error, id) => [{ type: API_TAGS.ORDER, id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: ORDER_PATH.CANCEL(id),
        method: "PATCH",
      }),
      invalidatesTags: [API_TAGS.ORDER, API_TAGS.PRODUCT],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useCancelOrderMutation,
} = orderApi;
