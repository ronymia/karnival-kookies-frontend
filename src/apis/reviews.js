import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllReviews = async ({id}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ratings/${id}`,
      {
        withCredentials: true,
      }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

// ----------------------------------------------------------------
// POST API
// ----------------------------------------------------------------
export const postReview = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ratings`,
      formData,
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
export const updateReview = async (formData) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ratings`,
      formData,
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
// export const deleteCategory = async ({ id }) => {
//   try {
//     const res = await axios.delete(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/${id}`,
//       { withCredentials: true }
//     );
//     return res?.data;
//   } catch (error) {
//     throw error;
//   }
// };
