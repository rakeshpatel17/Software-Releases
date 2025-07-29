import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL



const put_patches = async (patchname, formData) => {

  
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchname)}/`;

    const response = await axios.put(endpoint, formData);

    // On success, axios provides the parsed data directly in `response.data`.
    return response.data;
};


export default put_patches;