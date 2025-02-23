import { useDispatch } from "react-redux";

import {
  addItem,
  addToCartWithStockCheck,
  clearCart,
  removeItem,
  updateQuantity,
} from "../reducers/CartReducer";

export const useCartActions = () => {
  const dispatch = useDispatch();

  return {
    addItem: (item) => dispatch(addItem(item)),
    removeItem: (id) => dispatch(removeItem(id)),
    updateQuantity: (id, quantity) =>
      dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
    addToCartWithStockCheck: (item) => dispatch(addToCartWithStockCheck(item)),
    buyNow: (product, navigate) => {
      dispatch(addItem(product));
      navigate("/checkout");
    },
  };
};
