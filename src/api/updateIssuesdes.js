
import axios from 'axios';

export const securityIssuesUpdate = async (patchName, payload) => {
  const base_url = process.env.REACT_APP_BACKEND_URL;
  

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
    const response = await axios.patch(fullUrl, requestBody);

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