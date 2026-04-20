export const createBook = (data: any) => axios.post(`${API_URL}/books`, data);
export const updateBook = (id: string, data: any) => axios.put(`${API_URL}/books/${id}`, data);
export const getAuthors = () => axios.get(`${API_URL}/authors`);
export const getPublishers = () => axios.get(`${API_URL}/publishers`);
export const getAverageRating = (id: string) => axios.get(`${API_URL}/books/${id}/average-rating`);
export const getReviews = (id: string) => axios.get(`${API_URL}/books/${id}/reviews`);
export const addReview = (id: string, review: { username: string, rating: number, comment: string }) => 
  axios.post(`${API_URL}/books/${id}/reviews`, review);
import axios from 'axios';

// 1. Määrame andmete kuju (TypeScript interface)
export interface Book {
  id: number;
  title: string;
  author: string;
  PublishedYear: number;
  genres?: string[]; // küsimärk tähendab, et see on valikuline
}

// 2. Võtame aadressi .env failist (või kasutame defaulti)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// 3. Loome Axiose instantsi
const api = axios.create({
  baseURL: API_URL,
});

// 4. Ekspordime funktsioonid päringute tegemiseks
export const getBooks = (signal?: AbortSignal) => 
  api.get<Book[]>('/books', { signal });

export const deleteBook = (id: number) => 
  api.delete(`/books/${id}`);


export const getBookById = (id: string | number, signal?: AbortSignal) => 
  api.get<Book>(`/books/${id}`, { signal });

export default api;