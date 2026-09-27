import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { PRODUCT_PATH } from "./path";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (categoryId) => ({
        url: PRODUCT_PATH.GET_ALL,
        params: categoryId ? { category: categoryId } : {},
      }),
      providesTags: [API_TAGS.PRODUCT],
    }),
  }),
});

export const { useGetAllProductsQuery } = productApi;