import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  wishlistItems: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    ADD_TO_WISHLIST(state, action) {
      const productIndex = state.wishlistItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (productIndex >= 0) {
        toast.info(`${action.payload.name} is already in your wishlist`, {
          position: "top-left",
        });
      } else {
        const tempProduct = { ...action.payload };
        state.wishlistItems.push(tempProduct);
        toast.success(`${action.payload.name} added to wishlist`, {
          position: "top-left",
        });
      }
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
    REMOVE_FROM_WISHLIST(state, action) {
      const newWishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload.id
      );

      state.wishlistItems = newWishlistItems;
      toast.success(`${action.payload.name} removed from wishlist`, {
        position: "top-left",
      });

      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
    CLEAR_WISHLIST(state, action) {
      state.wishlistItems = [];
      toast.info(`Wishlist cleared`, {
        position: "top-left",
      });

      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
  },
});

export const {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST,
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.wishlistItems;

// Selector to get the total number of items in the wishlist
export const selectWishlistTotalQuantity = (state) =>
    state.wishlist.wishlistItems.length;

export default wishlistSlice.reducer;
