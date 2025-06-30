export const securityIssuesUpdate = async (patchName, payload) => {
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  console.log("payload : ",payload);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
  };


  const { productName, cveId } = payload;

  if (!productName || !cveId) {
      throw new Error("Payload must include 'productName' and 'cveId' for the API request.");
  }

  const fullUrl = `${base_url}/patches/${patchName}/products/${productName}/security-issues/${cveId}/`;
  
  const requestBody = {
      product_security_des: payload.product_security_des
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