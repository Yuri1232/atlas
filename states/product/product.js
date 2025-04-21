import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// thus

export const productAction = createAsyncThunk(
  "product/productAction",
  async (locale) => {
    const result = await axios.get(
      `${process.env.EXPO_PUBLIC_API}/products?locale=${locale}&populate=*`,
      {
        headers: { Authorization: ` bearer ${process.env.EXPO_PUBLIC_TOKEN}` },
      }
    );

    return result.data;
  }
);

const initialState = { pData: null, pError: null, pStatus: "idle" };
const productSlice = createSlice({
  initialState,
  name: "product",
  extraReducers: (builder) => {
    builder
      .addCase(productAction.pending, (state) => {
        state.pStatus = "loading";
      })
      .addCase(productAction.fulfilled, (state, action) => {
        state.pStatus = "succeeded";
        state.pData = action.payload;
      })
      .addCase(productAction.rejected, (state, action) => {
        state.pStatus = "failed";
        state.pError = action.error.message;
      });
  },
});

export default productSlice.reducer;
