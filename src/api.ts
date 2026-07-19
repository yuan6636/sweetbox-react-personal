import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const fakeToken = localStorage.getItem('token');

  if (fakeToken) {
    config.headers.Authorization = `Bearer ${fakeToken}`;
  }
  return config;
});
export default api;
