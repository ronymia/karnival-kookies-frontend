import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllCartItems = async ({ email }) => {
  console.log(email);
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/${email}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCheckouts = async ({ email, page, perPage }) => {
  console.log(email);
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/checkout/${email}?page=${page}&perPage=${perPage}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
export const getAllCheckoutsForAdmin = async ({ page, perPage }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/checkout/admin/all?page=${page}&perPage=${perPage}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

// ----------------------------------------------------------------
// POST API
// ----------------------------------------------------------------
export const postCart = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts`,
      formData,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
export const postCheckout = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/checkout`,
      formData,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
export const postPayment = async (products) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/create-payment`,
      products,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------------------------------
// PUT API
// ----------------------------------------------------------------

export const updateQuantity = async (info) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts`,
      info,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
export const updateStatus = async ({ id, status }) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/checkout/${id}`,
      { status },
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

// ----------------------------------------------------------------
// DELETE API
// ----------------------------------------------------------------
export const deleteCart = async ({ id }) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/${id}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCartItems = async (ids) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts`,
      { data: ids, withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
