import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const postAddress = createAsyncThunk(
  "address/createAddresss",
  async (data) => {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API}/addresses`,
      data,
      {
        headers: {
          Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
        },
      }
    );
    return response?.data;
  }
);
const initialState = {
  data: null,
  loading: false,
  error: null as string | null,
};
const userAddress = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload image cases
      //   .addCase(uploadImage.pending, (state) => {
      //     state.uploadStatus = "loading";
      //     state.uploadError = null;
      //   })
      //   .addCase(uploadImage.fulfilled, (state, action) => {
      //     state.uploadStatus = "succeeded";
      //     state.uploadedImageUrl = action.payload.url;
      //     state.uploadError = null;
      //   })
      //   .addCase(uploadImage.rejected, (state, action) => {
      //     state.uploadStatus = "failed";
      //     state.uploadError = action.payload as string;
      //   })
      //   // Get user cases
      //   .addCase(getCustomer.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(getCustomer.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.data = action.payload;
      //     state.error = null;
      //   })
      //   .addCase(getCustomer.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.payload as string;
      //   })
      //   // Post user cases
      //   .addCase(postUser.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(postUser.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.data = action.payload;
      //     state.error = null;
      //   })
      //   .addCase(postUser.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.payload as string;
      //   })
      // Update user cases
      .addCase(postAddress.pending, (state) => {
        state.loading = true;
        state.data = null;
      })
      .addCase(postAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(postAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userAddress.reducer;
