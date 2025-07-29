
import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL;


export const getSeverityCounts = async (products) => {
  console.log("Fetching severity counts for products:", products);

  const requestBody = {
    products: products
  };

  try {
    const response = await axios.post(`${base_url}/security-report/`, requestBody);

   
    return response.data.vulnerability_summary;

  } catch (error) {
  
    console.error("Server error while fetching severity counts:", error.response?.data || error.message);
    throw error;
  }
};