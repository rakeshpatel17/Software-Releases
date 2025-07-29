import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

// Fetch product completion status for a given patch ID (or version)
const getProductCompletion = async (patchId) => {
  try {
    if (!patchId) throw new Error("patchId is required");

    const endpoint = `${base_url}/patches/${patchId}/product-completion/`;

    // const response = await fetch(endpoint, {
    //   method: "GET",
    //   headers: {
    //     ...common_headers,
    //   },
    // });

    // if (!response.ok) throw new Error("Failed to fetch product completion");

    // const data = await response.json();

    // return data;
    const response = await axios.get(endpoint, {
      // headers: common_headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error in getProductCompletion:", error);
    return null;
  }
};

export default getProductCompletion;
