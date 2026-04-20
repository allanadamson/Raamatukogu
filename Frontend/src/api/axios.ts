import axios from 'axios';

const api = axios.create({
  // See loeb aadressi .env failist, mille me tegime
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export default api;