import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL

const get_security_issues = async (releaseId = null) => {
  try {
    const endpoint = `${base_url}/security-issues`; //endpoint for displaying all patches


    const response = await axios.get(endpoint);

    // On success, axios provides the parsed data in `response.data`.
    const data = response.data;

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
