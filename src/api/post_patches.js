  
const base_url = "http://127.0.0.1:8000"; // Backend URL
 
const common_headers = {
    "Content-Type": "application/json",
    // Add Authorization or other headers if needed
};
 
 
const post_patches = async (formData) => {
    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    //console.log(username +" "+ password);
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
   // console.log("Posting data:", formData);

    const response = await fetch(`${base_url}/patches/`, {
        method: 'POST',
        headers: {
            ...common_headers,  
            'Authorization': authHeader,
        },
        body: JSON.stringify(formData),
    });
 
    if (!response.ok) {
        const errorDetails = await response.json();  // <-- Key step
        console.error("Server error:", errorDetails); // Shows field-specific errors
        throw new Error('Network response was not ok');
        }
 
    const data = await response.json();
    return data;
};
 
 
export default post_patches;
 