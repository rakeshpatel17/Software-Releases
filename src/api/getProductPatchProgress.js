import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; 


const getProductPatchProgress = async (patchName, productName) => {
  // Validate input to prevent sending empty requests
  if (!patchName || !productName) {
    console.error("getProductPatchProgress requires both patchName and productName.");
    return null;
  }

  try {
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(productName)}/completion/`;

   
     const response = await axios.get(endpoint);
    return response.data.completion_percentage;
  } catch (error) {
    console.error("Error in getProductPatchProgress:", error);
    return null; 
  }
};

export default getProductPatchProgress;