// import axios from 'axios';
// const username = process.env.REACT_APP_USERNAME;
// const password = process.env.REACT_APP_PASSWORD;
// const authHeader = 'Basic ' + btoa(`${username}:${password}`);

// const common_headers = {
//   "Content-Type": "application/json",
//   'Authorization': authHeader,
//   // Add Authorization or other headers if needed

// };

// export const deletePatch = async (patchName) => {
//   const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
//   const username = process.env.REACT_APP_USERNAME;
//   const password = process.env.REACT_APP_PASSWORD;
//   const authHeader = 'Basic ' + btoa(`${username}:${password}`);
//   const common_headers = {
//     "Content-Type": "application/json",
//     'Authorization': authHeader
//   };
//   // const response = await fetch(`${base_url}/patches/${patchName}/`, {
//   const response = await fetch(`${base_url}/patches/${encodeURIComponent(patchName)}/`, {
//     method: 'DELETE',
//     headers: {
//       ...common_headers,
//     }
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || 'Failed to delete patch');
//   }

//   const text = await response.text();
//   return text ? JSON.parse(text) : { message: 'Patch deleted successfully' };

//   // return response.json();
// };

import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

export const deletePatch = async (patchName) => {
  try {
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchName)}/`;

    // Use axios.delete(url, config)
    const response = await axios.delete(endpoint, {
      headers: common_headers,
    });

   
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