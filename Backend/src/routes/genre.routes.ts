import { Router } from "express";
import * as genreController from "../controllers/genre.controller.js";

const router = Router();

router.get("/", genreController.getGenres);
router.post("/", genreController.addGenre);

export default router;