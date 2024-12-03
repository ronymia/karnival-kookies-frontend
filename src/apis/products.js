import axios from "axios";

// ----------------------------------------------------------------
// UPLOAD API
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// GET API
// ----------------------------------------------------------------
export const getAllProducts = async (filters) => {
  const {
    page = 1,
    perPage = 10,
    category = "",
    sortByNewest = "",
    fromPrice = "",
    toPrice = "",
    sortOrder = "",
  } = filters;

  try {
    // Initialize URLSearchParams for building query string
    const params = new URLSearchParams();

    // Add parameters to the query string only if they have values
    if (category) params.append("category", category);
    if (sortByNewest) params.append("sortByNewest", sortByNewest);
    if (fromPrice) params.append("fromPrice", fromPrice);
    if (toPrice) params.append("toPrice", toPrice);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (page) params.append("page", page);
    if (perPage) params.append("perPage", perPage);

    // Make the GET request with the dynamically built query string
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${params.toString()}`
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllIdAndNameOfProducts = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/all-products`
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
export const getProductsByCategory = async ({ id }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/category/${id}?limit=8`
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

// export const getServerSideProps = async (context) => {
//   const { id } = context.params; // Extract the 'id' from params
//   try {
//     const res = await axiosPublic.get(`/products?id=${id}`);
//     return {
//       props: {
//         product: res?.data,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: "Product not found",
//       },
//     };
//   }
// };

// ----------------------------------------------------------------
// POST API
// ----------------------------------------------------------------
export const postProduct = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
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
export const updateProduct = async (formData) => {
  console.log({ formData });
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};

// ----------------------------------------------------------------
// DELETE API
// ----------------------------------------------------------------
export const deleteProduct = async ({ id }) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (error) {
    throw error.response;
  }
};
