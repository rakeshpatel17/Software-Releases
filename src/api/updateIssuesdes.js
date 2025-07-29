// import axios from "axios";
// export const securityIssuesUpdate = async (patchName, payload) => {
//   const base_url = process.env.REACT_APP_BACKEND_URL;
//   const username = process.env.REACT_APP_USERNAME;
//   const password = process.env.REACT_APP_PASSWORD;
//   const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': authHeader,
//   };

//   // Extract identifiers for the URL from the payload
//   const { productName, cveId } = payload;

//   if (!productName || !cveId) {
//       throw new Error("Payload must include 'productName' and 'cveId' for the API request.");
//   }

//   const fullUrl = `${base_url}/patches/${patchName}/products/${productName}/security-issues/${cveId}/`;
  
  
//   const requestBody = {
//       product_security_des: payload.product_security_des,
//       cvss_score: payload.cvss_score,
//       severity: payload.severity,
//       affected_libraries: payload.affected_libraries
//   };

//   const response = await fetch(fullUrl, {
//     method: 'PATCH',
//     headers,
//     body: JSON.stringify(requestBody), 
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     try {
//         const errorJson = JSON.parse(errorText);
//         throw new Error(errorJson.error || 'Failed to update security issue');
//     } catch (e) {
//         throw new Error(errorText || 'Failed to update security issue');
//     }
//   }

//   const text = await response.text();
//   return text ? JSON.parse(text) : { message: 'Update successful' };
// };

import axios from 'axios';

export const securityIssuesUpdate = async (patchName, payload) => {
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const accessToken = authTokens?.access;  // Access token for API calls
  const authHeader = accessToken ? `Bearer ${accessToken}` : '';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
  };

  // This input validation and URL/body setup remains unchanged.
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

  try {
    // Use axios.patch(url, data, config)
    const response = await axios.patch(fullUrl, requestBody, /*{ headers }*/);

    return response.data || { message: 'Update successful' };

  } catch (error) {

    const serverError = error.response?.data;
    let errorMessage = 'Failed to update security issue';

    if (serverError) {
 
      errorMessage = serverError.error || (typeof serverError === 'string' ? serverError : JSON.stringify(serverError));
    } else {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};