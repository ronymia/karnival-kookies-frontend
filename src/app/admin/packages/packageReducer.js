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
  quantity: null, // number
  unit: "", // Default unit ('kg', 'litre', 'pcs', 'bag')
  images: [], // string[]
  status: "", // 'in-stock', 'out-of-stock', 'discontinued'
};

// FORM REDUCER
function formReducer(state, action) {
  console.log({ action });
  switch (action.type) {
    // FOR UPDATE FIELD
    case "UPDATE_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "ADD_IMAGE":
      return {
        ...state,
        [action.payload.field]: [...state?.images, ...action.payload.value],
      };
    case "REMOVE_IMAGE":
      return {
        ...state,
        [action.payload.field]: state?.images?.filter(
          (item) => item !== action.payload.value
        ),
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// REDUCER HOOK
const usePackageReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return { state, dispatch };
};

export default usePackageReducer;
