import * as BookService from "../services/book.service.js";
import { Request, Response } from "express";
import { bookSchema, updateBookSchema } from "../validators/book.validator.js";

export async function getBooks(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await BookService.getBooks(page, limit, {
      search: req.query.search as string | undefined,
    });

    return res.json(result);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    return res.status(500).json({ error: "Andmete pärimine ebaõnnestus" });
  }
}
export async function getBookById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Vigane raamatu ID" });
    }

    const book = await BookService.getBookById(id);

    if (!book) {
      return res.status(404).json({ error: "Raamatut ei leitud" });
    }

    return res.json(book);
  } catch (error) {
    console.error("GET BOOK BY ID ERROR:", error);
    return res.status(500).json({ error: "Serveri viga" });
  }
}

export async function addBook(req: Request, res: Response) {
  try {
    const result = bookSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Vigased andmed",
        details: result.error.format(),
      });
    }

    const book = await BookService.addBook(result.data);
    return res.status(201).json(book);
  } catch (error) {
    console.error("ADD BOOK ERROR:", error);
    return res.status(500).json({ error: "Lisamine ebaõnnestus" });
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Vigane raamatu ID" });
    }

    const result = updateBookSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Vigased andmed",
        details: result.error.format(),
      });
    }

    const updated = await BookService.updateBook(id, result.data);

    if (!updated) {
      return res.status(404).json({ error: "Raamatut ei leitud" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);
    return res.status(500).json({ error: "Uuendamine ebaõnnestus" });
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Vigane raamatu ID" });
    }

    const deleted = await BookService.deleteBook(id);

    if (!deleted) {
      return res.status(404).json({ error: "Raamatut ei leitud" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    return res.status(500).json({ error: "Kustutamine ebaõnnestus" });
  }
}

export async function getBookRating(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Vigane raamatu ID" });
    }

    const rating = await BookService.getBookRating(id);

    return res.json(rating);
  } catch (error) {
    console.error("GET BOOK RATING ERROR:", error);
    return res.status(500).json({ error: "Hinnangu pärimine ebaõnnestus" });
  }
}

export async function getBookReviews(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Vigane raamatu ID" });
    }

    const reviews = await BookService.getBookReviews(id);
    return res.json(reviews);
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    return res.status(500).json({ error: "Arvustuste laadimine ebaõnnestus" });
  }
}

export async function addBookReview(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Vigane raamatu ID" });
    }

    const review = await BookService.addBookReview(id, req.body);
    return res.status(201).json(review);
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);
    return res.status(500).json({ error: "Arvustuse lisamine ebaõnnestus" });
  }
}