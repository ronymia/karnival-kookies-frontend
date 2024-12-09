const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  totalQuantity: null,
  totalPrice: null,
  selectedItems: [],
  checkedId: [],
  payment_method: "",
  order_items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,
    addItems: (state, action) => {
      console.log({ payload: action.payload });

      // Ensure payload is an array
      const itemsToAdd = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      // Add new items to selectedItems
      state.selectedItems = [...state.selectedItems, ...itemsToAdd];

      // Update quantity
      state.totalQuantity = state.selectedItems.reduce(
        (total, item) => total + parseInt(item?.quantity || 0),
        0
      );

      // Update total price
      state.totalPrice = state.selectedItems.reduce((total, item) => {
        const price = item?.product?.discount_price
          ? parseFloat(item?.product?.discount_price)
          : parseFloat(item?.product?.regular_price);
        return total + price * Number(item?.quantity || 0);
      }, 0);
    },

    removeItems: (state, action) => {
      console.log({ payload: action.payload });

      // Filter out the item to remove
      state.selectedItems = state.selectedItems.filter(
        (item) => item?.id !== action.payload?.id
      );

      // Update total quantity
      state.totalQuantity = state.selectedItems.reduce(
        (total, item) => total + parseInt(item?.quantity || 0),
        0
      );

      // Update total price
      state.totalPrice = state.selectedItems.reduce((total, item) => {
        const price = item?.product?.discount_price
          ? parseFloat(item?.product?.discount_price)
          : parseFloat(item?.product?.regular_price);
        return total + price * Number(item?.quantity || 0);
      }, 0);
    },

    addIds: (state, action) => {
      console.log({ payload: action.payload });

      state.checkedId = [...state.checkedId, action.payload];
    },
    removeIds: (state, action) => {
      console.log({ payload: action.payload });

      state.checkedId = state.checkedId.filter((id) => id !== action?.payload);
    },
  },
});

export const { addIds, removeIds, addItems, removeItems, resetCart } =
  cartSlice.actions;

export default cartSlice.reducer;
