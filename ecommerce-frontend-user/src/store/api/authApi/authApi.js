import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { AUTH_PATH } from "./path";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.LOGIN,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.SIGNUP,
        method: "POST",
        body,
      }),
    }),
    me: builder.query({
      query: () => AUTH_PATH.ME,
      providesTags: [API_TAGS.AUTH],
    }),
    updateMeInfo: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_INFO,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
    updateMePassword: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_PASSWORD,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
    updateMeProfileImg: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_PROFILE_IMG,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useMeQuery,
  useUpdateMeInfoMutation,
  useUpdateMePasswordMutation,
  useUpdateMeProfileImgMutation,
} = authApi;