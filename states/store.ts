import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./home/home";
import productReducer from "./product/product";
import productDetailReducer from "./prodcutDetail/productDetail";
import uiReducer from "./ui/index";
import cartReducer from "./ui/cart";
import addressReducer from "./address/slice";
import userReducer from "./user/user";
import userCartReducer from "./user/cart";
import userAddressReducer from "./user/address";
const store = configureStore({
  reducer: {
    home: homeReducer,
    products: productReducer,
    productDetail: productDetailReducer,
    ui: uiReducer,
    cart: cartReducer,
    address: addressReducer,
    user: userReducer,
    userCart: userCartReducer,
    userAddress: userAddressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // ✅ Type for useSelector
export type AppDispatch = typeof store.dispatch; // ✅ Type for useDispatch

export default store;
