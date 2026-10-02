import { baseApi } from "../baseApi/baseApi";
import { UPLOAD_PATH } from "./path";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: UPLOAD_PATH.FILE,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
