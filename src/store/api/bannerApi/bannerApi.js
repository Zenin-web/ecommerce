import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { BANNER_PATH } from "./path";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => BANNER_PATH.GET_ALL,
      providesTags: [API_TAGS.BANNER],
    }),

    getAllBannersAdmin: builder.query({
      query: () => BANNER_PATH.GET_ALL_ADMIN,
      providesTags: [API_TAGS.BANNER],
    }),

    createBanner: builder.mutation({
      query: (body) => ({
        url: BANNER_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.BANNER],
    }),

    updateBanner: builder.mutation({
      query: ({ id, body }) => ({
        url: BANNER_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.BANNER],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: BANNER_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.BANNER],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetAllBannersAdminQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;