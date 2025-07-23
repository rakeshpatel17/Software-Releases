const base_url = process.env.REACT_APP_BACKEND_URL;
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader
};

export async function update_patch_image_jar(patchName, imageName, jarName, body) {
  if (!patchName || !imageName || !jarName) {
    console.error("patchName, imageName, and jarName are required.");
    return null;
  }

  try {
    const endpoint = `${base_url}/patchimagejars/${encodeURIComponent(patchName)}/${encodeURIComponent(imageName)}/${encodeURIComponent(jarName)}/`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: common_headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error("Failed to PATCH image-jar:", response.statusText);
      return null;
    }

    return await response.json(); // { status: "success", current_version, remarks, updated }
  } catch (err) {
    console.error("Error in update_patch_image_jar:", err);
    return null;
  }
}