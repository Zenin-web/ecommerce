import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CATEGORY_PATH } from "./path";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => CATEGORY_PATH.GET_ALL,
      providesTags: [API_TAGS.CATEGORY],
    }),

    getSingleCategory: builder.query({
      query: (id) => CATEGORY_PATH.GET_SINGLE(id),
      providesTags: [API_TAGS.CATEGORY],
    }),

    createCategory: builder.mutation({
      query: (body) => ({
        url: CATEGORY_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: CATEGORY_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: CATEGORY_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;