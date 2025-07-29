const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};
const getProductDetails = async (productId) => {
  try {
    const endpoint = `${base_url}/products/${productId}/`; // backend expects trailing slash
    // const response = await fetch(endpoint, {
    //   method: "GET",
    //   headers: {
    //         ...common_headers,
    //   }
    // });

    // if (!response.ok) throw new Error("Failed to fetch product details");

    // const data = await response.json();
    // // console.log("Fetched product details with images:", data.images);

    // // Ensure 'images' field is available
    // return data;
      const response = await axios.get(endpoint, {
      // headers: common_headers,
    });

    // On success, axios provides the parsed data in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    return null;
  }
};

export default getProductDetails;
