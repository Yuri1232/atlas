const { createSlice } = require("@reduxjs/toolkit");

const uiSlider = createSlice({
  name: "ui", // slice name
  initialState: {
    // initial state of the slice
    locale: "ar", // slider state
    headerTitle: null,
    color: "",
    ram: null,
    storage: null,
    opacity: 0,
    count: 1,
    cartIdAvailable: false,
  },
  reducers: {
    // reducers
    toggleSlider: (state, action) => {
      state.locale = action.payload;
    },

    HeaderTitileSetter: (state, action) => {
      state.headerTitle = action.payload;
    },
    colorSetter: (state, action) => {
      state.color = action.payload;
    },
    ramSetter: (state, action) => {
      state.ram = action.payload;
    },
    storageSetter: (state, action) => {
      state.storage = action.payload;
    },
    opacitySetters: (state, action) => {
      state.opacity = action.payload;
    },
    setCountQuantity: (state, action) => {
      state.count = action.payload;
    },
    cartIdAvailableSetter: (state, action) => {
      state.cartIdAvailable = action.payload;
    },
  },
});

const { actions, reducer } = uiSlider;
export const { toggleSlider } = actions;
export const { HeaderTitileSetter } = actions;
export const { colorSetter } = actions;
export const { ramSetter } = actions;
export const { storageSetter } = actions;
export const { opacitySetters } = actions;
export const { setCountQuantity } = actions;
export const { cartIdAvailableSetter } = actions;
export default reducer;
