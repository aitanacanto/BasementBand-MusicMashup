import express, { Request, Response } from "express";
import { getMBIDS } from "../../services/acousticBrainz/getMBIDS";
import { MusicBrainzRecording } from "../../types/MusicBrainzRecording";

export const MBIDRoute = express.Router();

MBIDRoute.get('/MBIDS/:title/:artist', async (req: Request, res: Response) => {
  let title : string = req.params.title;
  let artist : string = req.params.artist;
  let recordings : Array<MusicBrainzRecording> | null;

  try {
    recordings = await getMBIDS(title, artist);
    res.send(recordings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MusicBrainz ID" });
  }
});

MBIDRoute.get('/MBIDS/:title', async (req: Request, res: Response) => {
  let title : string = req.params.title;
  let recordings : Array<MusicBrainzRecording> | null;

  try {
    recordings = await getMBIDS(title);
    res.send(recordings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MusicBrainz ID" });
  }
});