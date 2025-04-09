import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const CartActions = createAsyncThunk(
  "cart/postCart",
  async (data: any) => {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API}/carts`,
      data,
      {
        headers: {
          Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
        },
      }
    );

    return response.data;
  }
);

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CartActions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(CartActions.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
    });
    builder.addCase(CartActions.rejected, (state, action) => {
      state.error = action.error.message || null;
      state.loading = false;
    });
  },
});

export default cartSlice.reducer;
