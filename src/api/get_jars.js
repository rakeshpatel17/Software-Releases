const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

const get_jars = async () => {
  try {
    const response = await fetch(`${base_url}/jars/`, {
      method: "GET",
      headers: {
        ...common_headers,
      }
    });

    if (!response.ok) throw new Error("Failed to fetch jars");

    const data = await response.json();
    // console.log("Jars Data:", data);
    return data;
  } catch (error) {
    console.error("Error in get_jars:", error);
    return [];
  }
};

export default get_jars;