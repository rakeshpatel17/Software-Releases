
const base_url = process.env.REACT_APP_BACKEND_URL;
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

export const getSeverityCounts = async (products) => {
    console.log("Fetching severity counts for products:", products);

    // The backend endpoint expects the list to be under a "products" key.
    const requestBody = {
        products: products
    };

    const response = await fetch(`${base_url}/security-report/`, {
        method: 'POST',
        headers: {
            ...common_headers,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Server error while fetching severity counts:", errorDetails);
        throw new Error('Network response was not ok');
    }

    // The backend returns { vulnerability_summary: {...}, products: [...] }
    // We only need the summary for this function.
    const data = await response.json();
    return data.vulnerability_summary;
};