import axios from "axios";
const host_url = process.env.REACT_APP_HOST_URL || 'https://default-url.com';
const auth = () => JSON.parse(localStorage.getItem('authTokens') || '{}');

// Ensure every request includes the latest access token
// Request interceptor
axios.interceptors.request.use(config => {
  const { access } = auth();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

axios.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    const { refresh } = auth();

    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((res, rej) => {
          failedQueue.push({ resolve: res, reject: rej });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return axios(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      if (!refresh) {
        return Promise.reject(new Error("No refresh token found"));
      }

      try {
        const resp = await axios.post(`${host_url}/token/refresh/`, { refresh });
        const newAuth = { access: resp.data.access, refresh: resp.data.refresh };
        localStorage.setItem('authTokens', JSON.stringify(newAuth));
        original.headers.Authorization = `Bearer ${newAuth.access}`;
        processQueue(null, newAuth.access);
        return axios(original);
      } catch (e) {
        processQueue(e, null);
        // Optionally trigger logout if refresh fails
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
