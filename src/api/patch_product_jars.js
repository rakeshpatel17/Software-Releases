const base_url = process.env.REACT_APP_BACKEND_URL; 
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader
};
const patch_product_jars = async (patchName, productName) => {
  if (!patchName || !productName) {
    console.error("Both patchName and productName must be provided.");
    return null;
  }

  try {
    // URL: /patchproductjars/{patch_name}/{product_name}/
    const endpoint = `${base_url}/patchproductjars/${encodeURIComponent(patchName)}/${encodeURIComponent(productName)}/`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        ...common_headers
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch patch-product jars: ${response.statusText}`);
    }

    const data = await response.json();
    // Expecting { "jars": [ { name, version, current_version, remarks, updated }, … ] }
    return data.jars ?? [];
  } catch (error) {
    console.error("Error in getPatchProductJars:", error);
    return null;
  }
};

export default patch_product_jars;
