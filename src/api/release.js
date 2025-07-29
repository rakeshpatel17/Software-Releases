import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;


const get_release = async () => {
  try {
    
     const response = await axios.get(`${base_url}/releases`);

    return response.data;

  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_release;