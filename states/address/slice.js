import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  selectedAddressId: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(
        (address) => address.id === action.payload.id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = null;
      }
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
  },
});

export const { addAddress, updateAddress, deleteAddress, setSelectedAddress } =
  addressSlice.actions;

export default addressSlice.reducer;
