import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { PRODUCT_PATH } from "./path";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => ({
        url: PRODUCT_PATH.GET_ALL,
        params,
      }),
      providesTags: [API_TAGS.PRODUCT],
    }),
    getSingleProduct: builder.query({
      query: (id) => PRODUCT_PATH.GET_SINGLE(id),
      providesTags: (result, error, id) => [{ type: API_TAGS.PRODUCT, id }],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetSingleProductQuery } = productApi;
