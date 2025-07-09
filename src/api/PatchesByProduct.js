
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

    if (!response.ok) {
      throw new Error(`Failed to fetch patches for product ${productName}. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};