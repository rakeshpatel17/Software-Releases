
export const securityIssuesUpdate = async (patchName, payload) => {
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const accessToken = authTokens?.access;  // Access token for API calls
  const authHeader = accessToken ? `Bearer ${accessToken}` : '';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
  };

  // Extract identifiers for the URL from the payload
  const { productName, cveId } = payload;

  if (!productName || !cveId) {
      throw new Error("Payload must include 'productName' and 'cveId' for the API request.");
  }

  const fullUrl = `${base_url}/patches/${patchName}/products/${productName}/security-issues/${cveId}/`;
  
  
  const requestBody = {
      product_security_des: payload.product_security_des,
      cvss_score: payload.cvss_score,
      severity: payload.severity,
      affected_libraries: payload.affected_libraries
  };

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(requestBody), 
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'Failed to update security issue');
    } catch (e) {
        throw new Error(errorText || 'Failed to update security issue');
    }
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Update successful' };
};