const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;

const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader,
};

const PatchProductSpecificDetails = async (patchName, productName) => {
  try {
    const safeProductName = productName ?? 'null';
    const response = await fetch(
      `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(safeProductName)}/`,
      {
        method: "GET",
        headers: {
          ...common_headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product detail for ${productName} in patch ${patchName}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export default PatchProductSpecificDetails;
