import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;


const PatchProductSpecificDetails = async (patchName, productName) => {
  try {
    const safeProductName = productName ?? 'null';
   

    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(safeProductName)}/`;

    const response = await axios.get(endpoint);

    // On a successful response, axios provides the parsed data in `response.data`.
    return response.data;

  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export default PatchProductSpecificDetails;
