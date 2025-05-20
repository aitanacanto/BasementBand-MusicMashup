import express, { Request, Response } from "express";
import { getMBID } from "../services/acousticBrainz/getMBID";

export const MBIDRoute = express.Router();

MBIDRoute.get('/MBID/:title/:artist', async (req: Request, res: Response) => {
  let title : string = req.params.title;
  let artist : string = req.params.artist;
  let MBID : string | null;

  try {
    MBID = await getMBID(title, artist);
    res.send(MBID);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MusicBrainz ID" });
  }
});

MBIDRoute.get('/MBID/:title', async (req: Request, res: Response) => {
  let title : string = req.params.title;
  let MBID : string | null;

  try {
    MBID = await getMBID(title);
    res.send(MBID);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MusicBrainz ID" });
  }
});