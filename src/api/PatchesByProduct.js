import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;


export const getPatchesByProduct = async (productName) => {
  if (!productName) {
    const errorMsg = "Product name cannot be empty.";
    console.error("API Error:", errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const url = `${base_url}/patches/product/${encodeURIComponent(productName)}/`;
    
 

    const response = await axios.get(url);

    // On a successful 2xx response, axios provides the data directly.
    return response.data;

  } catch (error) {
    // This will now only catch true errors (network issues, 500s, etc.)
    console.error("API Error:", error.message);
    throw error;
  }
};