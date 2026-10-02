import { baseApi } from "../baseApi/baseApi";
import { UPLOAD_PATH } from "./path";
export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_PATH.FILE,
        method: "POST",
        body: formData,
      }),
    }),
    uploadFiles: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_PATH.FILES,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});
export const { useUploadFileMutation, useUploadFilesMutation } = uploadApi;
