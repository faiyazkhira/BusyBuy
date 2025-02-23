import { useDispatch } from "react-redux";
import { useNotification } from "../../contexts/NotificationContext";
import {
  addItem,
  addToCartWithStockCheck,
  clearCart,
  removeItem,
  updateQuantity,
} from "../reducers/CartReducer";

export const useCartActions = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  return {
    addItem: (item) => dispatch(addItem(item)),
    removeItem: (id) => dispatch(removeItem(id)),
    updateQuantity: (id, quantity) =>
      dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
    addToCartWithStockCheck: (item) =>
      dispatch(addToCartWithStockCheck(item, showNotification)),
    buyNow: (product, navigate) => {
      dispatch(addItem(product));
      navigate("/checkout");
    },
  };
};
