import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, "Pealkiri on kohustuslik"),
  isbn: z.string().min(10),
  publishedYear: z.number().int().min(1000).max(2026),
  pageCount: z.number().positive(),
  language: z.string(),
  description: z.string(),
  authorId: z.number().int(),
  publisherId: z.number().int(),
  // MUUDA SIIN: string -> number ja lisa .optional() või .default([]), 
  // et tühja massiiviga ei tekiks viga
  genres: z.array(z.number()).optional() 
});

export const updateBookSchema = bookSchema.partial();