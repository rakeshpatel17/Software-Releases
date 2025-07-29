import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;
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

const getImageDetails = async (imageName, buildNumber) => {
  try {
    const endpoint = `${base_url}/images/${imageName}/${buildNumber}/`;

    // const response = await fetch(endpoint, {
    //   method: "GET",
    //   headers: { ...common_headers }
    // });

    // if (!response.ok) {
    //     console.error(`Failed to fetch details for ${imageName} (${buildNumber}): ${response.statusText}`);
    //     return null;
    // }

    // const data = await response.json();
    // return data;

     const response = await axios.get(endpoint, {
      // headers: common_headers
    });

    return response.data;
  } catch (error) {
    console.error(`Error in getImageDetails for ${imageName} (${buildNumber}):`, error);
    return null;
  }
};

export default getImageDetails;