import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./home/home";
import productReducer from "./product/product";
import productDetailReducer from "./prodcutDetail/productDetail";
import uiReducer from "./ui/index";

const store = configureStore({
  reducer: {
    home: homeReducer,
    products: productReducer,
    productDetail: productDetailReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // ✅ Type for useSelector
export type AppDispatch = typeof store.dispatch; // ✅ Type for useDispatch

export default store;
