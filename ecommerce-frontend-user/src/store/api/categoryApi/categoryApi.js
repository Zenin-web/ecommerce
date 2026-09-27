import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CATEGORY_PATH } from "./path";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => CATEGORY_PATH.GET_ALL,
      providesTags: [API_TAGS.CATEGORY],
    }),
    getCategoryById: builder.query({
      query: (id) => CATEGORY_PATH.GET_SINGLE(id),
      providesTags: (result, error, id) => [{ type: API_TAGS.CATEGORY, id }],
    }),
  }),
});

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery } = categoryApi;