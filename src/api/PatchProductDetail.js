const base_url = process.env.REACT_APP_BACKEND_URL;
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader,
};

const getPatchProductDetail = async (patchName, productName) => {
  try {
    const safeProductName = productName ?? 'null';
    const response = await fetch(
      `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(safeProductName)}/details/`,
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

export default getPatchProductDetail;
