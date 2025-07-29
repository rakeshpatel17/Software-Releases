import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL


const get_patches = async (releaseId = null) => {
  try {
    const endpoint = `${base_url}/patches`; //endpoint for displaying all patches

     const response = await axios.get(endpoint);
    const data = response.data;


    // Filter if releaseId is provided
    const filteredData =
      releaseId
        ? data.filter(patch => String(patch.release) === String(releaseId))
        : data;

    // console.log("filtered Patch Data:", filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error in get_patches:", error);
    return null;
  }
};

export default get_patches;
