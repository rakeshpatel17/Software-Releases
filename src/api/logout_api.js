// logout.js
import axios from 'axios';
const base_url = process.env.REACT_APP_BACKEND_URL;

const logout_api = async (authTokens, setAuthTokens, setUser) => {
  try {
    if (authTokens && authTokens.refresh) {
      // Sending logout request to the backend
      console.log("sending request to :",base_url+'/logout/');
      await axios.post(
        `${base_url}/logout/`, 
        { refresh_token: authTokens.refresh },
        {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,  // Add Authorization header
            }
        });

      // Clearing tokens and user data from state and localStorage
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem('authTokens');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed');
  }
};

export { logout_api };