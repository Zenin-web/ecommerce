import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi/baseApi";

// Har bir domen api fayli shu yerga import qilinishi kerak, chunki
// injectEndpoints faqat fayl import qilinganda ishga tushadi.
import "./api/authApi/authApi";
import "./api/categoryApi/categoryApi";
import "./api/productApi/productApi";
import "./api/cartApi/cartApi";
import "./api/orderApi/orderApi";
import "./api/reviewApi/reviewApi";
import "./api/favoriteApi/favoriteApi";
import "./api/addressApi/addressApi";
import "./api/uploadApi/uploadApi";
import "./api/bannerApi/bannerApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
