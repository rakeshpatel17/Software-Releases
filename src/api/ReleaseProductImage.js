import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL

const updateReleaseProductImage = async (release, productName, imageName, updateData) => {
  try {
    const endpoint = `${base_url}/release-images/${release}/${productName}/${imageName}/`;

   
     const response = await axios.put(endpoint, updateData);

    return response.data;
  } catch (error) {
    console.error("Error updating ReleaseProductImage:", error);
    return null;
  }
};

export { updateReleaseProductImage };
