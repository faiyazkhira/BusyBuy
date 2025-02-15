import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useReducer } from "react";
import { db } from "../services/firebase";
import { useNotification } from "./NotificationContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "add":
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "updateQuantity":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "clearCart":
      return initialState;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { showNotification } = useNotification();

  const addItem = (item) => dispatch({ type: "add", payload: item });
  const removeItem = (id) => dispatch({ type: "remove", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "updateQuantity", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "clearCart" });

  const addToCart = (product) => {
    dispatch({ type: "add", payload: product });
  };

  const buyNow = (product, navigate) => {
    dispatch({ type: "add", payload: product });
    navigate("/checkout"); // For example, navigate to the checkout page.
  };

  const handleAddToCart = async (item) => {
    try {
      const productRef = doc(db, "products", item.id);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        showNotification(`This product is no longer available`);
      }

      const productData = productDoc.data();
      const availableStock = productData.stock;

      if (availableStock <= 0) {
        showNotification(`Sorry, this product is out of stock!`);
        return;
      }

      if (
        state.items.find((cartItem) => cartItem.id === item.id)?.quantity >=
        availableStock
      ) {
        showNotification(
          `You've reached the maximum available quantity for this product`
        );
        return;
      }

      addToCart(item);
    } catch (error) {
      showNotification("Failed to add item to cart");
      console.error("Error checking stock:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        addToCart,
        buyNow,
        handleAddToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
