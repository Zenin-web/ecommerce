export const REVIEW_PATH = {
  GET_ALL_BY_PRODUCT: (productId) => `/review/get-all-by-product/${productId}`,
  CREATE: "/review/create",
  UPDATE: (id) => `/review/update/${id}`,
  DELETE: (id) => `/review/delete/${id}`,
};
