import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllFaqs = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs`);
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

// ----------------------------------------------------------------
// POST API
// ----------------------------------------------------------------
export const postFaq = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs`,
      formData,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
// ----------------------------------------------------------------
// PUT API
// ----------------------------------------------------------------
export const updateFaq = async (formData) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs`,
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
export const deleteFaq = async ({ id }) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs/${id}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
