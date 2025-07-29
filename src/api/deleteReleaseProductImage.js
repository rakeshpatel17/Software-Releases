import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL

const deleteReleaseProductImage = async (release, productName, imageName, updateData) => {
  try {
    const endpoint = `${base_url}/release-images/${release}/${productName}/${imageName}/`;

   
        const response = await axios.delete(endpoint, {
      data: updateData // axios automatically stringifies the data
    });

    return response.data || {};

  } catch (error) {
    console.error("Error :", error);
    return null;
  }
};

export { deleteReleaseProductImage };
