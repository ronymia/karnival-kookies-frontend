import { useReducer } from "react";

// INITIAL STATE
const initialState = {
  id: null /* number */,
  name: "",
  description: "",
  regularPrice: null /* number  */,
  discountPrice: null /* number */,
  category: null /* number */,
  is_active: 1 /* boolean */,
  inStock: null /* number */,
  images: [] /* string[] */,
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
const useProductReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return { state, dispatch };
};

export default useProductReducer;
