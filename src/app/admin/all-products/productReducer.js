import { useReducer } from "react";

// INITIAL STATE
const initialState = {
  id: null, // number
  name: "",
  description: "",
  price: null, // number (renamed from regular_price)
  is_discount_enable: null, // boolean (0 or 1)
  discount_value: null, // number
  discount_type: "", // "fixed" or "percent"
  category_id: null, // number
  quantity: null, // number
  unit: "", // Default unit ('kg', 'litre', 'pcs', 'bag')
  images: [], // string[]
  status: "", // 'in-stock', 'out-of-stock', 'discontinued'
};

// FORM REDUCER
function formReducer(state, action) {
  switch (action.type) {
    // FOR UPDATING ANY FIELD
    case "UPDATE_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };

    // ADD IMAGE
    case "ADD_IMAGE":
      return {
        ...state,
        images: [...state.images, ...action.payload.value],
      };

    // REMOVE IMAGE
    case "REMOVE_IMAGE":
      return {
        ...state,
        images: state.images.filter((item) => item !== action.payload.value),
      };

    // SET DATA
    case "SET_DATA":
      return { ...state, ...action.payload };

    // RESET FORM
    case "RESET_FORM":
      return initialState;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// REDUCER HOOK
const useProductReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return { state, dispatch };
};

export default useProductReducer;
