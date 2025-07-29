import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL

// Fetch product completion status for a given patch ID (or version)
const getProductCompletion = async (patchId) => {
  try {
    if (!patchId) throw new Error("patchId is required");

    const endpoint = `${base_url}/patches/${patchId}/product-completion/`;

    const response = await axios.get(endpoint);

    return response.data;
  } catch (error) {
    console.error("Error in getProductCompletion:", error);
    return null;
  }
};

export default getProductCompletion;
