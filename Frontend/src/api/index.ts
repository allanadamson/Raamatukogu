import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api/v1
});

export const getBooks = () => api.get('/books');
export const getBookById = (id: string | number) => api.get(`/books/${id}`);
export const createBook = (data: any) => api.post('/books', data);
// Kontrolli, et siin on tee /books/${id}
export const updateBook = (id: string | number, data: any) => api.patch(`/books/${id}`, data);

export default api;