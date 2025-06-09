const base_url = process.env.REACT_APP_BACKEND_URL; 
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader
};

export async function update_patch_product_jar(patchName, productName, jarName, body) {
  try {
    const endpoint = `${base_url}/patchproductjars/${encodeURIComponent(patchName)}/${encodeURIComponent(productName)}/${encodeURIComponent(jarName)}/`;
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: common_headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      console.error("Failed to PATCH jar:", response.statusText);
      return null;
    }
    return await response.json(); // { status: "success", remarks, updated }
  } catch (err) {
    console.error("Error in patchJarField:", err);
    return null;
  }
}
