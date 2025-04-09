const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  data: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state?.data.find(
        (item) => item?.slug === action.payload?.slug
      );
      if (existingItem) {
        return;
      } else {
        state.data.push({ ...action.payload, quantity: 1 }); // Ensure quantity starts at 1
      }
    },

    removeFromCart: (state, action) => {
      state.data = state.data.filter((item) => item.slug !== action.payload);
    },

    increaseQuantity: (state, action) => {
      const itemIndex = state?.data.findIndex(
        (item) => item.slug === action.payload
      );
      if (itemIndex !== -1) {
        state.data[itemIndex] = {
          ...state.data[itemIndex],
          quantity: state.data[itemIndex].quantity + 1,
        };
      }
    },
    decreaseQuantity: (state, action) => {
      const itemIndex = state?.data.findIndex(
        (item) => item.slug === action.payload
      );
      if (itemIndex !== -1) {
        if (state.data[itemIndex].quantity > 1) {
          state.data[itemIndex] = {
            ...state.data[itemIndex],
            quantity: state.data[itemIndex].quantity - 1,
          };
        } else {
          state.data.splice(itemIndex, 1); // Remove item if quantity reaches 0
        }
      }
    },
  },
});

export const { removeFromCart, addToCart, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
