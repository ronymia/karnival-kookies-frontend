const { useReducer } = require("react");

const initialState = {
  user_id: null,
  order_items: [
    { product_id: 1, quantity: 2, price: 10.0 },
    { product_id: 2, quantity: 1, price: 20.0 },
    { product_id: 3, quantity: 1, price: 30.0 },
  ],
  shipping_info: {
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    deliveryInstruction: "",
  },
  payment_info: {
    cardNumber: "",
    cardExpiry: "",
    paymentGateway: "Stripe",
  },
  payment_method: "",
  notes: "",
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
          [action.payload.key]: action.payload.value,
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
