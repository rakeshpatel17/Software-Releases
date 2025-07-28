import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};
const deleteReleaseProductImage = async (release, productName, imageName, updateData) => {
  try {
    const endpoint = `${base_url}/release-images/${release}/${productName}/${imageName}/`;

    // const response = await fetch(endpoint, {
    //   method: "DELETE", 
    //   headers: common_headers,
    //   body: JSON.stringify(updateData)
    // });

    // if (!response.ok) {
    //   throw new Error("Failed to delete image");
    // }

    //  const text = await response.text();
    // return text ? JSON.parse(text) : {};

        const response = await axios.delete(endpoint, {
      headers: common_headers,
      data: updateData // axios automatically stringifies the data
    });

    return response.data || {};

  } catch (error) {
    console.error("Error :", error);
    return null;
  }
};

export { deleteReleaseProductImage };
