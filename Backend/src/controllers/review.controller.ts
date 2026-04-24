import { Request, Response } from "express";
import * as ReviewService from "../services/review.service.js";
import { reviewSchema } from "../validators/review.validator.js";

// POST - Lisa arvustus
export async function addReview(req: Request, res: Response) {
  try {
    // 1. Valideerime andmed (kontrollime, et rating on 1-5 jne)
    const result = reviewSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: result.error.flatten().fieldErrors 
      });
    }

    // 2. Saadame andmed teenusesse (Service)
    const review = await ReviewService.createReview(result.data);
    
    // 3. Vastame kliendile
    res.status(201).json(review);
  } catch (error: any) {
    console.error("REVIEW ERROR:", error);
    res.status(500).json({ 
      error: "Arvustuse lisamine ebaõnnestus", 
      message: error.message 
    });
  }
}