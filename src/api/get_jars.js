import axios from "axios";
const base_url = process.env.REACT_APP_BACKEND_URL;


const get_jars = async () => {
  try {
   
     const response = await axios.get(`${base_url}/jars/`);

    return response.data;
  } catch (error) {
    console.error("Error in get_jars:", error);
    return [];
  }
};

export default get_jars;