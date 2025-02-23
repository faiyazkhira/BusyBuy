import { createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const INITIAL_STATE = {
  items: [],
};

export const addToCartWithStockCheck =
  (item, showNotification) => async (dispatch, getState) => {
    try {
      const productRef = doc(db, "products", item.id);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        showNotification("This product is no longer available");
        return;
      }

      const productData = productDoc.data();
      const availableStock = productData.stock;

      if (availableStock <= 0) {
        showNotification("Sorry, this product is out of stock!");
        return;
      }

      const currentItem = getState().cartReducer.items.find(
        (cartItem) => cartItem.id === item.id
      );
      const currentQuantity = currentItem?.quantity || 0;

      if (currentQuantity >= availableStock) {
        showNotification("You've reached the maximum available quantity");
        return;
      }

      dispatch(addItem(item));
    } catch (error) {
      showNotification("Failed to add item to cart");
      console.error("Error checking stock:", error);
    }
  };

const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) item.quantity = quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;
