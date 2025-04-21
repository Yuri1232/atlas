import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const CartPostActions = createAsyncThunk(
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

export const CartGetAction = createAsyncThunk("cart/getCart", async () => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_API}/carts?populate[product][populate]=image,features&populate=customer`,
    {
      headers: {
        Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
      },
    }
  );

  return response.data;
});

// New action to update cart item quantity
export const CartUpdateQuantityAction = createAsyncThunk(
  "cart/updateQuantity",
  async ({
    cartItemId,
    quantity,
  }: {
    cartItemId: string | number;
    quantity: number;
  }) => {
    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_API}/carts/${cartItemId}`,
      {
        data: {
          quantity,
        },
      },
      {
        headers: {
          Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
        },
      }
    );

    return response.data;
  }
);

// New action to delete cart item
export const CartDeleteItemAction = createAsyncThunk(
  "cart/deleteItem",
  async (cartItemId: string | number) => {
    await axios.delete(`${process.env.EXPO_PUBLIC_API}/carts/${cartItemId}`, {
      headers: {
        Authorization: `bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
      },
    });

    return cartItemId;
  }
);

const initialState = {
  cart: [],
  loading: false,
  error: null as string | null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CartGetAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(CartGetAction.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
    });
    builder.addCase(CartGetAction.rejected, (state, action) => {
      state.error = action.error.message || null;
      state.loading = false;
    });

    // Handle update quantity action
    builder.addCase(CartUpdateQuantityAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(CartUpdateQuantityAction.fulfilled, (state) => {
      // No need to update state here as we'll refetch the cart after update
      state.loading = false;
    });
    builder.addCase(CartUpdateQuantityAction.rejected, (state, action) => {
      state.error = action.error.message || null;
      state.loading = false;
    });

    // Handle delete item action
    builder.addCase(CartDeleteItemAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(CartDeleteItemAction.fulfilled, (state) => {
      // No need to update state here as we'll refetch the cart after deletion
      state.loading = false;
    });
    builder.addCase(CartDeleteItemAction.rejected, (state, action) => {
      state.error = action.error.message || null;
      state.loading = false;
    });
  },
});

export default cartSlice.reducer;
