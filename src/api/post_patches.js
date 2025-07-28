
//  const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
// const username = process.env.REACT_APP_USERNAME;
// const password = process.env.REACT_APP_PASSWORD;
// const authHeader = 'Basic ' + btoa(`${username}:${password}`);
// const common_headers = {
//   "Content-Type": "application/json",
//   'Authorization': authHeader
// };
 
 
// const post_patches = async (formData) => {
   
//     console.log("Posting data:", formData);
 
//     const response = await fetch(`${base_url}/patches/`, {
//         method: 'POST',
//         headers: {
//             ...common_headers,  // Spread common_headers here
//         },
 
//         body: JSON.stringify(formData),
//     });
 
//     if (!response.ok) {
//         const errorDetails = await response.json();  // <-- Key step
//         console.error("Server error:", errorDetails); // Shows field-specific errors
//         throw new Error('Network response was not ok');
//         }
 
//     const data = await response.json();
//     return data;
// };
 
 
// export default post_patches;
 

import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};


const post_patches = async (formData) => {
  console.log("Posting data:", formData);

  try {
    const response = await axios.post(`${base_url}/patches/`, formData, {
      headers: common_headers,
    });

    return response.data;

  } catch (error) {

    console.error("Server error:", error.response?.data || error.message);

    throw error;
  }
};


export default post_patches;