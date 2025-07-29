import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;
const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const accessToken = authTokens?.access;  // Access token for API calls
const authHeader = accessToken ? `Bearer ${accessToken}` : '';
const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader
};


export async function toggleLockByNames(patchName, imageName, lockValue) {
  try {
    const endpoint = `${base_url}/patchimages/lock-by-names/`;
    const body = JSON.stringify({
      patch: patchName,
      image: imageName,
      lock: lockValue
    });
    // const response = await fetch(endpoint, {
    //   method: "PATCH",
    //   headers: common_headers,
    //   body
    // });

    // if (!response.ok) {
    //   const err = await response.json();
    //   console.error("toggleLockByNames failed:", err);
    //   return null;
    // }
    // return await response.json();

     const response = await axios.patch(endpoint, body, {
      // headers: common_headers
    });

    return response.data;
  } catch (error) {
    console.error("Error in toggleLockByNames:", error);
    return null;
  }
}