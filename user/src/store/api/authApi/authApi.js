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
      invalidatesTags: [API_TAGS.USER],
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.SIGNUP,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.USER],
    }),
    me: builder.query({
      query: () => AUTH_PATH.ME,
      providesTags: [API_TAGS.USER],
    }),
    updateMeInfo: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_INFO,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.USER],
    }),
    updateMePassword: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_PASSWORD,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.USER],
    }),
    updateMeProfileImg: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_PROFILE_IMG,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.USER],
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
