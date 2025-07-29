import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;


export async function update_patch_image_jar(patchName, imageName, jarName, body) {
  if (!patchName || !imageName || !jarName) {
    console.error("patchName, imageName, and jarName are required.");
    return null;
  }

  try {
    const endpoint = `${base_url}/patchimagejars/${encodeURIComponent(patchName)}/${encodeURIComponent(imageName)}/${encodeURIComponent(jarName)}/`;

  
     const response = await axios.patch(endpoint, body);

    return response.data;
  } catch (err) {
    console.error("Error in update_patch_image_jar:", err);
    return null;
  }
}