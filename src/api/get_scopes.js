import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

const get_scopes = async () => {
  try {
    // const response = await fetch(`${base_url}/high-level-scopes/`, {
    //   method: "GET",
    //   headers: {
    //     ...common_headers,
    //   }
    // });

    // if (!response.ok) throw new Error("Failed to fetch jars");

    // const data = await response.json();
    // // console.log("Jars Data:", data);
    // return data;
     const response = await axios.get(`${base_url}/high-level-scopes/`, {
      headers: common_headers,
    });

    // On success, axios provides the parsed data in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in get_jars:", error);
    return [];
  }
};

export default get_scopes;