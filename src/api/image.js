const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL

const getProductDetails = async (productId) => {
  try {
    const endpoint = `${base_url}/products/${productId}/`; // backend expects trailing slash
   
      const response = await axios.get(endpoint);

    // On success, axios provides the parsed data in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    return null;
  }
};

export default getProductDetails;
