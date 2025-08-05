// login.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const host_url= process.env.REACT_APP_HOST_URL;

const login_api = async (email, password, setAuthTokens, setUser) => {
  try {
    // Sending login request to the backend
    const response = await axios.post(`${host_url}/security/token/`, { email, password });

    // On success, store tokens and user info in state and localStorage
    setAuthTokens(response.data);
    setUser(jwtDecode(response.data.access));
    localStorage.setItem('authTokens', JSON.stringify(response.data));

    return response.data; // Return data if needed
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed');
  }
};

export { login_api };
