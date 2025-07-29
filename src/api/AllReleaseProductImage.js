import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL

const AllReleaseProductImage = async () => {
  try {
    const endpoint = `${base_url}/release-images/`; // Endpoint to fetch all patches

     const response = await axios.get(endpoint);



    return response.data;
  } catch (error) {
    console.error("Error in ReleaseProductImage:", error);
    return null;
  }
};

export { AllReleaseProductImage };
