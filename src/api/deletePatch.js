

import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL;


export const deletePatch = async (patchName) => {
  try {
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/`;

    // Use axios.delete(url, config)
    const response = await axios.delete(endpoint);

   
    return response.data || { message: 'Patch deleted successfully' };

  } catch (error) {
    console.error("Error deleting patch:", error);

    // Provide more specific error info if available
    const errorMessage = error.response?.data?.detail || error.response?.data || error.message;
    console.error("Backend response:", errorMessage);

    throw new Error(errorMessage || 'Failed to delete patch');
    
    // return null;
  }
};