import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;



export async function toggleLockByNames(patchName, imageName, lockValue) {
  try {
    const endpoint = `${base_url}/patchimages/lock-by-names/`;
    const body = JSON.stringify({
      patch: patchName,
      image: imageName,
      lock: lockValue
    });
  

     const response = await axios.patch(endpoint, body);

    return response.data;
  } catch (error) {
    console.error("Error in toggleLockByNames:", error);
    return null;
  }
}