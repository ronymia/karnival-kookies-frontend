// ==================== CHECKOUT PURE REDUCER (NO REACT) ====================

export const initialCheckoutState = {
  user_id: null,
  step: 1,
  shipping_info: {
    recipient_name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "United States",
    postal_code: "",
    carrier: "Standard Expedited Carrier",
    delivery_instruction: "",
  },
  payment: {
    order_id: "",
    transaction_id: "",
    amount: 0,
    method: "stripe",
    status: "pending",
  },
};

export function checkoutReducer(state = initialCheckoutState, action) {
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, user_id: action.payload };

    case "SET_STEP":
      return { ...state, step: action.payload };

    case "NEXT_STEP":
      return { ...state, step: Math.min(4, state.step + 1) };

    case "PREV_STEP":
      return { ...state, step: Math.max(1, state.step - 1) };

    case "UPDATE_SHIPPING_INFO":
      return {
        ...state,
        shipping_info: {
          ...state.shipping_info,
          [action.payload.field]: action.payload.value,
        },
      };

    case "SET_ALL_SHIPPING_INFO":
      return {
        ...state,
        shipping_info: {
          ...state.shipping_info,
          ...action.payload,
        },
      };

    case "UPDATE_PAYMENT_INFO":
      return {
        ...state,
        payment: {
          ...state.payment,
          ...action.payload,
        },
      };

    case "RESET_CHECKOUT":
      return initialCheckoutState;

    default:
      return state;
  }
}
