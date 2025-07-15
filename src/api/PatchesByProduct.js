
const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;

const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader,
};

export const getPatchesByProduct = async (productName) => {
  if (!productName) {
    const errorMsg = "Product name cannot be empty.";
    console.error("API Error:", errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const url = `${base_url}/patches/product/${encodeURIComponent(productName)}/`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...common_headers,
      },
    });

   

    // If the status is 404, it means the product exists but has no patches.
    // This is a valid case, so we return an empty array.
    if (response.status === 404) {
      return []; 
    }


    // For any other non-successful status, throw an error.
    if (!response.ok) {
      throw new Error(`Failed to fetch patches for product ${productName}. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // This will now only catch true errors (network issues, 500s, etc.)
    console.error("API Error:", error.message);
    throw error;
  }
};