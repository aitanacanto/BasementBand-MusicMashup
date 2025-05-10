import express, { Request, Response, Router } from "express";

export const SimilarityRouter = express.Router();

SimilarityRouter.get('/SimilarSongs/:MBID', (req: Request, res: Response) => {
    res.send("Similar songs");
  });