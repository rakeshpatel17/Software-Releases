import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;



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
    const response = await axios.post(fullUrl, requestBody);

    return response.data.product_security_des || '—';
  }
  catch (error) {
    console.error("Fetch API error in fetchDescription:", error);
    return '—';
  }
};