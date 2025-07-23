const base_url = process.env.REACT_APP_BACKEND_URL;
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

const get_release = async () => {
  try {
    const response = await fetch(`${base_url}/releases`, {
      method: "GET",
      headers: {
            ...common_headers,
      }
    });

    if (!response.ok) throw new Error("Failed to fetch releases");

    const data = await response.json();
    // console.log("Release Data:", data);
    return data;
  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_release;