const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
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

const get_patch_progress = async (patchName) => {
  try {
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/completion/`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        ...common_headers
      }
    });

    if (!response.ok) throw new Error(`Failed to fetch patch progress for ${patchName}`);

    const data = await response.json();
    return data.completion_percentage; // Number, e.g. 40.0
  } catch (error) {
    console.error("Error in get_patch_progress:", error);
    return null;
  }
};

export default get_patch_progress;
