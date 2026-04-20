import axios from 'axios';

// 1. Määrame andmete kuju (TypeScript interface)
export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre?: string[]; // küsimärk tähendab, et see on valikuline
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