import axios from "axios";
const host_url = process.env.REACT_APP_HOST_URL;
const auth = JSON.parse(localStorage.getItem('authTokens'));
const refresh_token = auth?.refresh;
let refresh = false;
axios.interceptors.response.use(
  resp => resp,
  async error => {
    if (error.response?.status === 401 && !refresh) {
      refresh = true;

      try {
        const response = await axios.post(
          `${host_url}/token/refresh/`,
          {
            refresh_token: refresh_token
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );

        if (response.status === 200) {
          const newAccess = response.data.access;
          const newRefresh = response.data.refresh;
          const newAuthTokens = {
            access: newAccess,
            refresh: newRefresh,
          };
          localStorage.setItem('authTokens', JSON.stringify(newAuthTokens));
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        //   localStorage.setItem('access_token', newAccess);
        //   localStorage.setItem('refresh_token', newRefresh);

          // Retry the original failed request with new token
          error.config.headers['Authorization'] = `Bearer ${newAccess}`;
          return axios(error.config);
        }
      } catch (err) {
        console.error("Token refresh failed", err);
        // Optionally log out user here or redirect to login
      }
    }

    refresh = false;
    return Promise.reject(error);
  }
);
