import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// thus

export const productDetailAction = createAsyncThunk(
  "productDetail/productDetailAction",
  async (locale) => {
    const result = await axios.get(
      `${process.env.EXPO_PUBLIC_API}/product-details?locale=${locale}&populate=deep`,
      {
        headers: { Authorization: ` bearer ${process.env.EXPO_PUBLIC_TOKEN}` },
      }
    );

    return result.data;
  }
);

const initialState = { pdData: null, pdError: null, pdStatus: "idle" };
const productDetailSlice = createSlice({
  initialState,
  name: "product",
  extraReducers: (builder) => {
    builder
      .addCase(productDetailAction.pending, (state) => {
        state.pdStatus = "loading";
      })
      .addCase(productDetailAction.fulfilled, (state, action) => {
        state.pdStatus = "succeeded";
        state.pdData = action.payload;
      })
      .addCase(productDetailAction.rejected, (state, action) => {
        state.pdStatus = "failed";
        state.pdError = action.error.message;
      });
  },
});

export default productDetailSlice.reducer;
