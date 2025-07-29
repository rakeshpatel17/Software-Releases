
import axios from 'axios';

const get_products = async () => {
  try {
   
     const response = await axios.get("/product.json");

    // On success, axios provides the parsed data in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in get_products:", error);
    return null;
  }
};

export default get_products;
