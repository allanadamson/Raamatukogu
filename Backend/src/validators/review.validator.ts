import { z } from 'zod';

export const reviewSchema = z.object({
  bookId: z.number().int().positive(),
  userName: z.string().min(1, "Nimi on kohustuslik"),
  rating: z.number().int().min(1).max(5, "Hinne peab olema vahemikus 1-5"),
  comment: z.string().optional()
});