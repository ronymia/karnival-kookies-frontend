const { useReducer } = require("react");

const initialState = {
  user_id: null,
  order_items: [],
  shipping_info: {
    recipient_name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    carrier: "Pathao carrier",
    delivery_instruction: "",
  },
  payment: {
    order_id: "",
    transaction_id: "",
    stripe_payment_intent_id: "",
    stripe_payment_method_id: "",
    amount: "",
    method: "",
    status: "",
  },
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, user_id: action.payload };

    case "UPDATE_ORDER_ITEM":
      const updatedOrderItems = [...state.order_items];
      updatedOrderItems[action.payload.index][action.payload.key] =
        action.payload.value;
      return { ...state, order_items: updatedOrderItems };

    case "ADD_ORDER_ITEM":
      return { ...state, order_items: [...state.order_items, action.payload] };

    case "REMOVE_ORDER_ITEM":
      return {
        ...state,
        order_items: state.order_items.filter(
          (_, index) => index !== action.payload
        ),
      };

    case "UPDATE_SHIPPING_INFO":
      return {
        ...state,
        shipping_info: {
          ...state.shipping_info,
          [action.payload.field]: action.payload.value,
        },
      };

    case "UPDATE_PAYMENT_INFO":
      return {
        ...state,
        payment_info: {
          ...state.payment_info,
          [action.payload.key]: action.payload.value,
        },
      };

    case "SET_PAYMENT_METHOD":
      return { ...state, payment_method: action.payload };

    case "SET_NOTES":
      return { ...state, notes: action.payload };

    default:
      return state;
  }
};

const useCheckoutReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return { state, dispatch };
};

export default useCheckoutReducer;
