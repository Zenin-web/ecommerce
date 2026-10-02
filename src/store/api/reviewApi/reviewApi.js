import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { REVIEW_PATH } from "./path";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviewsByProduct: builder.query({
      query: ({ productId, ...params }) => ({ url: REVIEW_PATH.GET_ALL_BY_PRODUCT(productId), params }),
      providesTags: [API_TAGS.REVIEW],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({ url: REVIEW_PATH.UPDATE(id), method: "PATCH", body }),
      invalidatesTags: [API_TAGS.REVIEW, API_TAGS.PRODUCT],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: REVIEW_PATH.DELETE(id), method: "DELETE" }),
      invalidatesTags: [API_TAGS.REVIEW, API_TAGS.PRODUCT],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: REVIEW_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.REVIEW, API_TAGS.PRODUCT],
    }),
  }),
});

export const { useGetAllReviewsByProductQuery, useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } = reviewApi;
