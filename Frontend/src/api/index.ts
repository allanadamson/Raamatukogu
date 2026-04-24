import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
});

export const getBooks = () => api.get('/books');
export const getBookById = (id: string) => api.get(`/books/${id}`);
export const createBook = (data: any) => api.post('/books', data);
export const updateBook = (id: string | number, data: any) => api.patch(`/books/${id}`, data);
export const deleteBook = (id: string) => api.delete(`/books/${id}`);

export default api;