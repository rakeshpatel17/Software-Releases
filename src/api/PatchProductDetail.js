import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;

const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader,
};

const getPatchProductDetail = async (patchName, productName) => {
  try {
    const safeProductName = productName ?? 'null';
    // const response = await fetch(
    //   `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(safeProductName)}/details/`,
    //   {
    //     method: "GET",
    //     headers: {
    //       ...common_headers,
    //     },
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch product detail for ${productName} in patch ${patchName}`);
    // }

    // const data = await response.json();
    // return data;

    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/products/${encodeURIComponent(safeProductName)}/details/`;

    const response = await axios.get(endpoint, {
        headers: common_headers,
    });

    // On a successful response, axios provides the parsed data in `response.data`.
    return response.data;

  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export default getPatchProductDetail;
