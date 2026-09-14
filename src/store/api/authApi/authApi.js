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
    updateMeEmail: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_EMAIL,
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
    }),
    updateMeProfileImg: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_PROFILE_IMG,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.USER],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: AUTH_PATH.GET_ALL_USERS,
        params,
      }),
      providesTags: [API_TAGS.USER],
    }),
    getSingleUser: builder.query({
      query: (id) => AUTH_PATH.GET_SINGLE_USER(id),
      providesTags: [API_TAGS.USER],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: AUTH_PATH.DELETE_USER(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.USER],
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useUpdateMeInfoMutation,
  useUpdateMeEmailMutation,
  useUpdateMePasswordMutation,
  useUpdateMeProfileImgMutation,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useDeleteUserMutation,
} = authApi;
