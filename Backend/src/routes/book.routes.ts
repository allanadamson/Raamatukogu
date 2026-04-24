import { Router } from 'express';
import * as BookController from '../controllers/book.controller.js';

const router = Router();

router.get("/", BookController.getBooks);
router.post("/", BookController.addBook);

router.get("/:id/average-rating", BookController.getBookRating);
router.get("/:id/reviews", BookController.getBookReviews);
router.post("/:id/reviews", BookController.addBookReview);

router.get("/:id", BookController.getBookById);
router.patch("/:id", BookController.updateBook);
router.put("/:id", BookController.updateBook); // lisa see
router.delete("/:id", BookController.deleteBook);

export default router;