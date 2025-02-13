import axios from "axios";

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllUsers = async ({ page, perPage }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/all?page=${page}&perPage=${perPage}`,
      {
        withCredentials: true,
      }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
export const getUser = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/info`,
      {
        withCredentials: true,
      }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

// ----------------------------------------------------------------
// POST API
// ----------------------------------------------------------------
export const createUser = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      formData
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      formData
    );
    return res?.data;
  } catch (error) {
    throw error?.response;
  }
};

export const isUserExist = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/is-user-exist`,
      formData
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

export const jwt = async (user) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/jwt`,
      user,
      {
        withCredentials: true, // Add this line to include cookies
      }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
// ----------------------------------------------------------------
// PUT API
// ----------------------------------------------------------------
export const verifyUser = async ({ email, otp }) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/auth/verify-user-email`,
      { email, otp }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
export const updateUser = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${data?.email}`,
      data,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateUserPassword = async (email, info) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/reset-password/${email}`,
      info
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
