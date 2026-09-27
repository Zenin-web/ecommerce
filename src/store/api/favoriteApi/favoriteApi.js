import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { FAVORITE_PATH } from "./path";

export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyFavorites: builder.query({
      query: () => FAVORITE_PATH.GET_MY_FAVORITES,
      providesTags: [API_TAGS.FAVORITE],
    }),
    toggleFavorite: builder.mutation({
      query: (body) => ({
        url: FAVORITE_PATH.TOGGLE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.FAVORITE],
    }),
  }),
});

export const { useGetMyFavoritesQuery, useToggleFavoriteMutation } = favoriteApi;
