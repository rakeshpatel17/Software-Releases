
const base_url = process.env.REACT_APP_BACKEND_URL;
// const username = process.env.REACT_APP_USERNAME;
// const password = process.env.REACT_APP_PASSWORD;

// const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';

const common_headers = {
  'Content-Type': 'application/json', // This is required for sending a JSON body
  'Authorization': authHeader
};


export const fetchDescription = async (context) => {
  const { 
    patchName, 
    productName, 
    cve_id, 
    cvss_score, 
    severity, 
    affected_libraries 
  } = context;

  if (!patchName || !productName || !cve_id || cvss_score === undefined || !severity || !affected_libraries) {
    const errorMessage = "Cannot fetch description: one or more required identifiers are missing from context.";
    console.error(errorMessage, context);
    return '—';
  }

  const fullUrl = `${base_url}/get-security-description/`;

  const requestBody = {
    patchName: patchName,
    productName: productName,
    cve_id: cve_id,
    cvss_score: cvss_score,
    severity: severity,
    affected_libraries: affected_libraries
  };
  
  try {
    const response = await fetch(fullUrl, {
        method: 'POST', 
        headers: {
            ...common_headers,
        },
        body: JSON.stringify(requestBody), 
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Server error (${response.status}) while fetching description:`, errorDetails);
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data.product_security_des || '—';

  } catch (error) {
    console.error("Fetch API error in fetchDescription:", error);
    return '—';
  }
};