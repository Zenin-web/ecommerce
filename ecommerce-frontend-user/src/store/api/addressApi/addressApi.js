import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { ADDRESS_PATH } from "./path";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAddresses: builder.query({
      query: () => ADDRESS_PATH.GET_ALL_ME,
      providesTags: [API_TAGS.ADDRESS],
    }),
    createAddress: builder.mutation({
      query: (body) => ({
        url: ADDRESS_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.ADDRESS],
    }),
    updateAddress: builder.mutation({
      query: ({ id, body }) => ({
        url: ADDRESS_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.ADDRESS],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: ADDRESS_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.ADDRESS],
    }),
  }),
});

export const {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;