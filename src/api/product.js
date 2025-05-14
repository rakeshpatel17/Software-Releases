const base_url = "http://127.0.0.1:8000"; // Backend URL

const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader,
  // Add Authorization or other headers if needed

};

// const get_user = async () => {
  
// };

const get_release = async () => {
  try {
    const response = await fetch(`${base_url}/products`, {
      method: "GET",
      headers: common_headers,
    });

    if (!response.ok) throw new Error("Failed to fetch releases");

    const data = await response.json();
    // console.log("product Data:", data);
    return data;
  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_release;