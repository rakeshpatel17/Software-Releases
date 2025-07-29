import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};
const updateReleaseProductImage = async (release, productName, imageName, updateData) => {
  try {
    const endpoint = `${base_url}/release-images/${release}/${productName}/${imageName}/`;

    // const response = await fetch(endpoint, {
    //   method: "PUT", // or PATCH if partial update
    //   headers: common_headers,
    //   body: JSON.stringify(updateData)
    // });

    // if (!response.ok) {
    //   throw new Error("Failed to update image");
    // }

    // return await response.json();
     const response = await axios.put(endpoint, updateData, {
      // headers: common_headers
    });

    return response.data;
  } catch (error) {
    console.error("Error updating ReleaseProductImage:", error);
    return null;
  }
};

export { updateReleaseProductImage };
