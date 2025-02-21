const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  totalQuantity: null,
  totalPrice: null,
  selectedItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,
    addItems: (state, action) => {
      const itemToAdd = action.payload;

      // Add new item
      state.selectedItems.push({ ...itemToAdd });

      // Update total quantity
      state.totalQuantity = state.selectedItems.reduce(
        (total, item) => total + Number(item?.quantity || 0),
        0
      );

      // Update total price
      state.totalPrice = state.selectedItems.reduce((total, item) => {
        const price = item?.product?.is_discount_enable
          ? parseFloat(item?.product?.net_price)
          : parseFloat(item?.product?.price);

        return total + price * Number(item?.quantity || 0);
      }, 0);
    },

    removeItems: (state, action) => {
      const itemToRemove = action.payload;

      // Filter out the item to remove
      state.selectedItems = state.selectedItems.filter(
        (item) => item?.id !== itemToRemove?.id
      );

      // Update total quantity
      state.totalQuantity = state.selectedItems.reduce(
        (total, item) => total + parseInt(item?.quantity || 0),
        0
      );

      // Update total price
      state.totalPrice = state.selectedItems.reduce((total, item) => {
        // GET PRICE
        const price = item?.product?.is_discount_enable
          ? parseFloat(item?.product?.net_price)
          : parseFloat(item?.product?.price);

        // CALCULATE TOTAL PRICE OF QUANTITY
        return total + price * Number(item?.quantity || 0);
      }, 0);
    },
  },
});

export const { addItems, removeItems, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
