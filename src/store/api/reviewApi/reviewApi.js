import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { REVIEW_PATH } from "./path";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviewsByProduct: builder.query({
      query: (productId) => REVIEW_PATH.GET_ALL_BY_PRODUCT(productId),
      providesTags: (result, error, productId) => [{ type: API_TAGS.REVIEW, id: productId }],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: REVIEW_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, body) => [{ type: API_TAGS.REVIEW, id: body?.product }],
    }),
  }),
});

export const { useGetAllReviewsByProductQuery, useCreateReviewMutation } = reviewApi;
