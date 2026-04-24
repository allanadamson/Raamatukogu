import { Router } from "express";
import * as reviewController from "../controllers/review.controller.js";

const router = Router();

// POST http://localhost:3000/api/v1/reviews
router.post("/", reviewController.addReview);

export default router;