import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL


const get_products = async () => {
  try {
    
     const response = await axios.get(`${base_url}/products`);

    // On success, axios provides the parsed JSON data directly in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_products;