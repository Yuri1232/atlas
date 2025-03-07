const { createSlice } = require("@reduxjs/toolkit");

const uiSlider = createSlice({
  name: "ui", // slice name
  initialState: {
    // initial state of the slice
    locale: "ar", // slider state
    headerTitle: null,
  },
  reducers: {
    // reducers
    toggleSlider: (state, action) => {
      state.locale = action.payload;
    },

    HeaderTitileSetter: (state, action) => {
      state.headerTitle = action.payload;
    },
  },
});

const { actions, reducer } = uiSlider;
export const { toggleSlider } = actions;
export const { HeaderTitileSetter } = actions;
export default reducer;
