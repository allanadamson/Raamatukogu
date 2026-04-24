import { Request, Response } from "express";
import * as genreService from "../services/genre.service.js";

export async function getGenres(req: Request, res: Response) {
  try {
    const genres = await genreService.getAllGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Žanrite pärimine ebaõnnestus" });
  }
}

export async function addGenre(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nimi on kohustuslik" });
    
    const genre = await genreService.createGenre(name);
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: "Žanri loomine ebaõnnestus" });
  }
}