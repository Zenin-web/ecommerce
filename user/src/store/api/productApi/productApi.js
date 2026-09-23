import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { PRODUCT_PATH } from "./path";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => PRODUCT_PATH.GET_ALL,
      providesTags: [API_TAGS.PRODUCT],
    }),
  }),
});

export const { useGetAllProductsQuery } = productApi;