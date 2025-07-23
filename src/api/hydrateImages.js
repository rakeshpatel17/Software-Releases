
const base_url     = process.env.REACT_APP_BACKEND_URL;
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  'Content-Type':  'application/json',
  'Authorization': authHeader,
};

const hydrateImages = async (products) => {
    // console.log("products sednding are  : ", products);
    
  try {
    const res = await fetch(`${base_url}/hydrate-product-images/`, {
      method:  'POST',
      headers: { ...common_headers },
      body:    JSON.stringify({"products":products}),
    });
    if (!res.ok) throw new Error(`Hydrate failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error in hydrateImages:', err);
    return [];
  }
};

export default hydrateImages;
