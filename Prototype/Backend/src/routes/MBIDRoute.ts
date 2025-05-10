import express, { Request, Response, Router } from "express";

export const MBIDRoute = express.Router();

MBIDRoute.get('/MBID/:title/:artist', (req: Request, res: Response) => {
    res.send("MBID");
  });