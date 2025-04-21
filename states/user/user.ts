import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  uploadStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadError: string | null;
  uploadedImageUrl: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  updateStatus: "idle",
  updateError: null,
  uploadStatus: "idle",
  uploadError: null,
  uploadedImageUrl: null,
};

// Create async thunk for uploading images
export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API}/upload`,
        formData,
        {
          headers: {
            Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

// Create async thunk for getting user data
export const getCustomer = createAsyncThunk(
  "user/getCustomer",
  async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API}/customers/find-one/${userId}`,
        {
          headers: {
            Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return error.response?.data?.message || "Failed to fetch user data";
    }
  }
);

// Create async thunk for posting user data
export const postUser = createAsyncThunk(
  "user/postUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API}/customers`,
        formData,
        {
          headers: {
            Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log("response.data", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
);

// Create async thunk for updating user data
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    { userId, userData }: { userId: string; userData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API}/customers/by-slug/${userId}`,
        userData,
        {
          headers: {
            Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.uploadStatus = "idle";
      state.uploadError = null;
      state.uploadedImageUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload image cases
      .addCase(uploadImage.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.uploadedImageUrl = action.payload.url;
        state.uploadError = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload as string;
      })
      // Get user cases
      .addCase(getCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Post user cases
      .addCase(postUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(postUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.data = action.payload;
        state.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as string;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
