// src/schemas/book.schema.ts
import { z } from "zod";

export const CreateBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Pealkiri on kohustuslik"),
    isbn: z.string().min(10, "ISBN peab olema vähemalt 10 märki"),
    publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
    pageCount: z.number().int().positive(),
    language: z.string(),
    description: z.string(),
    authorId: z.number().int(),
    publisherId: z.number().int(),
    genres: z.array(z.number()).optional()
  })
});