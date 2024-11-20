import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllAdminDashboardItems = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/admin`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUserDashboardItems = async ({ email }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/user/${email}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
