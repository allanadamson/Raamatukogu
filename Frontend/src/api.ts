import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export type Author = {
  id: number;
  firstName: string;
  lastName: string;
  birthYear: number;
  nationality: string;
  biography?: string | null;
};

export type Publisher = {
  id: number;
  name: string;
  country: string;
  foundedYear: number;
  website?: string | null;
};

export type Genre = {
  id: number;
  name: string;
};

export type Review = {
  id: number;
  bookId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Book = {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount?: number;
  pages?: number;
  language: string;
  description: string;
  coverImage?: string | null;
  author: Author;
  publisher: Publisher;
  genres: Genre[];
  reviews?: Review[];
};

export type BooksResponse = {
  data: Book[];
  total: number;
  page: number;
  limit: number;
};

export type RatingResponse = {
  averageRating: number;
  reviewCount: number;
};

export type BookPayload = {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  authorId: number;
  publisherId: number;
};

export type ReviewPayload = {
  userName: string;
  rating: number;
  comment: string;
};

export type BookQuery = {
  page: number;
  limit: number;
  search?: string;
  year?: string;
  language?: string;
  sortBy?: "title" | "publishedYear";
  sortOrder?: "asc" | "desc";
};

export function getBooks(params: BookQuery, signal?: AbortSignal) {
  return api.get<BooksResponse>("/books", { params, signal });
}

export function getBookById(id: number, signal?: AbortSignal) {
  return api.get<Book>(`/books/${id}`, { signal });
}

export function createBook(data: BookPayload) {
  return api.post<Book>("/books", data);
}

export function updateBook(id: number, data: Partial<BookPayload>) {
  return api.put<Book>(`/books/${id}`, data);
}

export function deleteBook(id: number) {
  return api.delete(`/books/${id}`);
}

export function getBookRating(id: number, signal?: AbortSignal) {
  return api.get<RatingResponse>(`/books/${id}/average-rating`, { signal });
}

export function getBookReviews(id: number, signal?: AbortSignal) {
  return api.get<Review[]>(`/books/${id}/reviews`, { signal });
}

export function createReview(bookId: number, data: ReviewPayload) {
  return api.post<Review>(`/books/${bookId}/reviews`, data);
}