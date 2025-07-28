import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};

const get_release = async () => {
  try {
    // const response = await fetch(`${base_url}/releases`, {
    //   method: "GET",
    //   headers: {
    //         ...common_headers,
    //   }
    // });

    // if (!response.ok) throw new Error("Failed to fetch releases");

    // const data = await response.json();
    // // console.log("Release Data:", data);
    // return data;
     const response = await axios.get(`${base_url}/releases`, {
      headers: common_headers,
    });

    return response.data;

  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_release;