

import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL



const post_patches = async (formData) => {
  console.log("Posting data:", formData);

  try {
    const response = await axios.post(`${base_url}/patches/`, formData);

    return response.data;

  } catch (error) {

    console.error("Server error:", error.response?.data || error.message);

    throw error;
  }
};


export default post_patches;