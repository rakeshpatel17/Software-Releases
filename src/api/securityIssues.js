const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

const get_security_issues = async (releaseId = null) => {
  try {
    const endpoint = `${base_url}/security-issues`; //endpoint for displaying all patches

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
            ...common_headers,
      }
    });

    if (!response.ok) throw new Error("Failed to fetch security-issues");

    const data = await response.json();

    // Filter if releaseId is provided
    const filteredData =
      releaseId
        ? data.filter(patch => String(patch.release) === String(releaseId))
        : data;

    // console.log("filtered Patch Data:", filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error in get_security_issues:", error);
    return null;
  }
};

export default get_security_issues;
