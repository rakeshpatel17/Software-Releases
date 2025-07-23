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
const AllReleaseProductImage = async () => {
  try {
    const endpoint = `${base_url}/release-images/`; // Endpoint to fetch all patches

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        ...common_headers,
      }
    });

    if (!response.ok) throw new Error("Failed to fetch patches");

     const data = await response.json();
    // if (Array.isArray(data)) {
    //   return data[0] || null;
    // }

    return data;
  } catch (error) {
    console.error("Error in ReleaseProductImage:", error);
    return null;
  }
};

export { AllReleaseProductImage };
