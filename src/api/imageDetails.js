import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;


const getImageDetails = async (imageName, buildNumber) => {
  try {
    const endpoint = `${base_url}/images/${imageName}/${buildNumber}/`;


     const response = await axios.get(endpoint);

    return response.data;
  } catch (error) {
    console.error(`Error in getImageDetails for ${imageName} (${buildNumber}):`, error);
    return null;
  }
};

export default getImageDetails;