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
      invalidatesTags: [API_TAGS.ORDER],
    }),

    getMyOrders: builder.query({
      query: () => ORDER_PATH.GET_ALL_ME,
      providesTags: [API_TAGS.ORDER],
    }),

    getAllOrdersAdmin: builder.query({
      query: () => ORDER_PATH.GET_ALL_ADMIN,
      providesTags: [API_TAGS.ORDER],
    }),

    getAdminStats: builder.query({
      query: () => ORDER_PATH.GET_ADMIN_STATS,
      providesTags: [API_TAGS.ORDER],
    }),

    getSingleOrder: builder.query({
      query: (id) => ORDER_PATH.GET_SINGLE(id),
      providesTags: [API_TAGS.ORDER],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: ORDER_PATH.UPDATE_STATUS(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.ORDER],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: ORDER_PATH.CANCEL(id),
        method: "PATCH",
      }),
      invalidatesTags: [API_TAGS.ORDER],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersAdminQuery,
  useGetAdminStatsQuery,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;