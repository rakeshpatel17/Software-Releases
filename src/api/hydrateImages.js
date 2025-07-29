import axios from "axios";
const base_url     = process.env.REACT_APP_BACKEND_URL;


const hydrateImages = async (products) => {
    
  try {
  
     const response = await axios.post(`${base_url}/hydrate-product-images/`, 
      { "products": products }, // The data object, axios handles stringifying
    );
    
    return response.data;
  } catch (err) {
    console.error('Error in hydrateImages:', err);
    return [];
  }
};

export default hydrateImages;
