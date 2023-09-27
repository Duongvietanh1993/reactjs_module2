import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice/userSlice";
import categorySlice from "./categorySlice/categorySlice";
import productSlice from "./productSlice/productSlice";
import orderSlice from "./orderSlice/orderSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    category: categorySlice,
    product: productSlice,
    order: orderSlice,
  },
});
