import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { BANNER_PATH } from "./path";
export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => BANNER_PATH.GET_ALL,
      providesTags: [API_TAGS.BANNER],
    }),
  }),
});
export const { useGetAllBannersQuery } = bannerApi;
