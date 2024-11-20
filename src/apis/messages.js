import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllMessages = async ({ page, perPage }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages?page=${page}&perPage=${perPage}`,
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
export const postMessage = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`,
      formData
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

// ----------------------------------------------------------------
// DELETE API
// ----------------------------------------------------------------
export const deleteMessage = async ({ id }) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${id}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
