import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CATEGORY_PATH } from "./path";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => CATEGORY_PATH.GET_ALL,
      providesTags: [API_TAGS.CATEGORY],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryApi;