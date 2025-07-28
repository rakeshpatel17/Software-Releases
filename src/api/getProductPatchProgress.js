import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; 
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;

const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};



const getProductPatchProgress = async (patchName, productName) => {
  // Validate input to prevent sending empty requests
  if (!patchName || !productName) {
    console.error("getProductPatchProgress requires both patchName and productName.");
    return null;
  }

  try {
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(productName)}/completion/`;

    // const response = await fetch(endpoint, {
    //   method: "GET",
    //   headers: {
    //     ...common_headers
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch patch progress for product ${productName} in patch ${patchName}. Status: ${response.status}`);
    // }

    // const data = await response.json();
    // return data.completion_percentage; // e.g., 75.5
     const response = await axios.get(endpoint, {
      headers: common_headers
    });
    return response.data.completion_percentage;
  } catch (error) {
    console.error("Error in getProductPatchProgress:", error);
    return null; 
  }
};

export default getProductPatchProgress;