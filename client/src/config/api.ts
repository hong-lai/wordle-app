import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5555/api/v1',
});

export default api;