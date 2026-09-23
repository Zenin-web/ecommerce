export const CART_PATH = {
  GET_MY_CART: "/cart/get-my-cart",
  ADD_ITEM: "/cart/add-item",
  UPDATE_ITEM: (productId) => `/cart/update-item/${productId}`,
  REMOVE_ITEM: (productId) => `/cart/remove-item/${productId}`,
  CLEAR: "/cart/clear",
};
