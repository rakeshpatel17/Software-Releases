import axios from 'axios';

const base_url = process.env.REACT_APP_BACKEND_URL;


const get_scopes = async () => {
  try {
    
     const response = await axios.get(`${base_url}/high-level-scopes/`);

    // On success, axios provides the parsed data in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in get_jars:", error);
    return [];
  }
};

export default get_scopes;