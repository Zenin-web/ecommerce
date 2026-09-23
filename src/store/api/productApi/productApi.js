import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { PRODUCT_PATH } from "./path";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => PRODUCT_PATH.GET_ALL,
      providesTags: [API_TAGS.PRODUCT],
    }),

    getAllAdminProducts: builder.query({
      query: () => PRODUCT_PATH.GET_ALL_ADMIN,
      providesTags: [API_TAGS.PRODUCT],
    }),

    getSingleProduct: builder.query({
      query: (id) => PRODUCT_PATH.GET_SINGLE(id),
      providesTags: [API_TAGS.PRODUCT],
    }),

    createProduct: builder.mutation({
      query: (body) => ({
        url: PRODUCT_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.PRODUCT],
    }),

    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: PRODUCT_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.PRODUCT],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: PRODUCT_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.PRODUCT],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetAllAdminProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;