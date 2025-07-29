import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL

const createReleaseProductImage = async (data) => {
  try {
   
    const endpoint = `${base_url}/release-images/`;

    // Use axios.post(url, data, config)
    const response = await axios.post(endpoint, data);

    // Axios automatically handles JSON and throws errors on failure.
    // The successful response data is in `response.data`.
    return response.data;

  } catch (error) {
    console.error("Error creating ReleaseProductImage:", error);
    return null;
  }
};


export { createReleaseProductImage };
