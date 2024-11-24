import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllDiscounts = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/discounts`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

// ----------------------------------------------------------------
// POST API
// ----------------------------------------------------------------
export const postDiscount = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/discounts`,
      formData,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error?.response;
  }
};
// ----------------------------------------------------------------
// PUT API
// ----------------------------------------------------------------
export const updateDiscount = async (formData) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/discounts`,
      formData,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

// ----------------------------------------------------------------
// DELETE API
// ----------------------------------------------------------------
export const deleteDiscount = async ({ id }) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/discounts/${id}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
