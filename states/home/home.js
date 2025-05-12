import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch data
export const homeAction = createAsyncThunk(
  "home/homeAction",
  async (locale, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        `${process.env.EXPO_PUBLIC_API}/home?locale=ar&populate[0]=slider&populate[1]=card.logo&populate[2]=social_media&populate[3]=contacts&populate[4]=map&populate[5]=navbar.dropdown`,
        {
          headers: {
            Authorization: ` bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
          },
        }
      );

      return result.data.data.attributes; // Success response will return the data
    } catch (error) {
      // Return error message using rejectWithValue to ensure error handling is consistent
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: null,
  error: null,
  status: "idle",
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(homeAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(homeAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Set the fetched data
      })
      .addCase(homeAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message or object
      });
  },
});

export default homeSlice.reducer;
