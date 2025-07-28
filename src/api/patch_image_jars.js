import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  "Authorization": authHeader
};

const patch_image_jars = async (patchName, imageName) => {
  if (!patchName || !imageName) {
    console.error("Both patchName and imageName must be provided.");
    return null;
  }

  try {
    // Updated URL: /patchimagejars/{patch_name}/{image_name}/
    const endpoint = `${base_url}/patchimagejars/${encodeURIComponent(patchName)}/${encodeURIComponent(imageName)}/`;

    // const response = await fetch(endpoint, {
    //   method: "GET",
    //   headers: {
    //     ...common_headers
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch patch-image jars: ${response.statusText}`);
    // }

    // const data = await response.json();
    // // Expecting { "jars": [ { name, current_version, remarks, updated }, … ] }
    // return data.jars ?? [];

    const response = await axios.get(endpoint, {
      headers: common_headers
    });
        return response.data.jars ?? [];

  } catch (error) {
    console.error("Error in patch_image_jars:", error);
    return null;
  }
};

export default patch_image_jars;