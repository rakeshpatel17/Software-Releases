import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL
// const username = process.env.REACT_APP_USERNAME;
// const password = process.env.REACT_APP_PASSWORD;
// const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};
const createReleaseProductImage = async (data) => {
  try {
    // const response = await fetch(`${base_url}/release-images/`, {
    //   method: "POST",
    //   headers: common_headers,
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   const errorText = await response.text(); 
    //   console.error("Backend response:", errorText); 
    //   throw new Error("Failed to create entry");
    // }

    // return await response.json();
    const endpoint = `${base_url}/release-images/`;

    // Use axios.post(url, data, config)
    const response = await axios.post(endpoint, data, {
      // headers: common_headers,
    });

    // Axios automatically handles JSON and throws errors on failure.
    // The successful response data is in `response.data`.
    return response.data;

  } catch (error) {
    console.error("Error creating ReleaseProductImage:", error);
    return null;
  }
};


export { createReleaseProductImage };
