const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  totalQuantity: null,
  totalPrice: null,
  selectedItems: [],
  isDrawerOpen: false,
  appliedCoupon: null, // { code, discount_type, discount_value, minimum_spend, description }
  activeCampaign: null, // Applied promotional campaign from evaluate endpoint
  freeItems: [], // Free gift or BOGO items unlocked [{ name, quantity, image, product_id }]
  isFreeShipping: false, // Whether campaign waives delivery charge ($0)
  campaignDiscount: 0, // Discount amount computed by campaign engine
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,

    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.activeCampaign = null;
      state.campaignDiscount = 0;
    },

    setCampaignEvaluation: (state, action) => {
      const evaluation = action.payload || {};
      state.activeCampaign = evaluation.applied_campaign || null;
      state.freeItems = Array.isArray(evaluation.free_items) ? evaluation.free_items : [];
      state.isFreeShipping = Boolean(evaluation.free_shipping);
      state.campaignDiscount = Number(evaluation.discount_amount || 0);
    },

    clearCampaignEvaluation: (state) => {
      state.activeCampaign = null;
      state.freeItems = [];
      state.isFreeShipping = false;
      state.campaignDiscount = 0;
    },

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
          ? Number.parseFloat(item?.product?.net_price)
          : Number.parseFloat(item?.product?.price);

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
        (total, item) => total + Number.parseInt(item?.quantity || 0, 10),
        0
      );

      // Update total price
      state.totalPrice = state.selectedItems.reduce((total, item) => {
        const price = item?.product?.is_discount_enable
          ? Number.parseFloat(item?.product?.net_price)
          : Number.parseFloat(item?.product?.price);

        return total + price * Number(item?.quantity || 0);
      }, 0);
    },
  },
});

export const {
  addItems,
  removeItems,
  resetCart,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  applyCoupon,
  removeCoupon,
  setCampaignEvaluation,
  clearCampaignEvaluation,
} = cartSlice.actions;

export default cartSlice.reducer;
