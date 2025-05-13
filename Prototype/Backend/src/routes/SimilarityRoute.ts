import express, { Request, Response } from "express";
import { getSimilarSongs } from "../getSimilarSongs";

export const SimilarityRouter = express.Router();

SimilarityRouter.get('/SimilarSongs/:MBID', async (req: Request, res: Response) => {
  let MBID : string = req.params.MBID;
  let NUM_RESULTS : number = 10;
  let metric : string = "key"
  let SimilarSongs : Array<string> | null;
  let requestURL = 
  `https://acousticbrainz.org/api/v1/similarity/${metric}?recording_ids=${MBID}&n_neighbours=${NUM_RESULTS}`

try {
  SimilarSongs = await getSimilarSongs(requestURL);
  res.send(SimilarSongs);
} catch (error) {
  res.status(500).json({ error: "Failed to fetch Songs" });
}
});

