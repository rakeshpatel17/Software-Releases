import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
    "Content-Type": "application/json",
    'Authorization': authHeader
};


const put_patches = async (patchname, formData) => {

    // console.log("Posting data:", formData);
    // const patchName = formData.get('name'); 

    // const response = await fetch(`${base_url}/patches/${encodeURIComponent(patchname)}/`, {
    //     method: 'PUT',
    //     headers: {
    //         ...common_headers,  // Spread common_headers here
    //     },

    //     body: JSON.stringify(formData),
    // });

    // if (!response.ok) {
    //     const errorDetails = await response.json();  // <-- Key step
    //     console.error("Server error:", errorDetails); // Shows field-specific errors
    //     throw new Error('Network response was not ok');
    //     }

    // const data = await response.json();
    // return data;
    const endpoint = `${base_url}/patches/${encodeURIComponent(patchname)}/`;

    const response = await axios.put(endpoint, formData, {
        headers: common_headers,
    });

    // On success, axios provides the parsed data directly in `response.data`.
    return response.data;
};


export default put_patches;