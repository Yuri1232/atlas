const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  data: [],
};

console.log("Younusssssssss", initialState.data);
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log("action.payload", action.payload);
      const existingItem = state?.data?.find(
        (item) => item.id === action.payload?.id
      );
      console.log("existingItem", state?.data[0]);

      if (existingItem) {
        return;
      } else {
        state.data.push({ ...action.payload, quantity: 1 }); // Ensure quantity starts at 1
      }
    },

    removeFromCart: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },

    increaseQuantity: (state, action) => {
      const itemIndex = state?.data.findIndex(
        (item) => item.attributes?.id === action.payload
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
        (item) => item.attributes?.id === action.payload
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
