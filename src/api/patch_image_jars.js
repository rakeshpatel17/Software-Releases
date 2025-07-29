import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;



const patch_image_jars = async (patchName, imageName) => {
  if (!patchName || !imageName) {
    console.error("Both patchName and imageName must be provided.");
    return null;
  }

  try {
    // Updated URL: /patchimagejars/{patch_name}/{image_name}/
    const endpoint = `${base_url}/patchimagejars/${encodeURIComponent(patchName)}/${encodeURIComponent(imageName)}/`;

  

    const response = await axios.get(endpoint);
        return response.data.jars ?? [];

  } catch (error) {
    console.error("Error in patch_image_jars:", error);
    return null;
  }
};

export default patch_image_jars;