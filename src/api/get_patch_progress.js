import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL


const get_patch_progress = async (patchName) => {
  try {
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/completion/`;

   
        const response = await axios.get(endpoint);

   
    return response.data.completion_percentage;

  } catch (error) {
    console.error("Error in get_patch_progress:", error);
    return null;
  }
};

export default get_patch_progress;
