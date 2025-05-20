import express, { Request, Response } from "express";
import { getSimilarSongs } from "../../services/acousticBrainz/getSimilarSongs"
import { Song } from "../../types/song"

export const SimilarityRouter = express.Router();

SimilarityRouter.get('/SimilarSongs/:MBID', async (req: Request, res: Response) => {
  let MBID : string = req.params.MBID;
  let NUM_RESULTS : number = 24;  //24 neighbours each time as low level batch request only takes 25 MBIDs, and we need to include the original.
  let metric : string = "key"
  let SimilarSongs : Array<Song> | null;
  let requestURL = 
  `https://acousticbrainz.org/api/v1/similarity/${metric}?recording_ids=${MBID}&n_neighbours=${NUM_RESULTS}`

try {
  SimilarSongs = await getSimilarSongs(MBID, requestURL);
  res.send(SimilarSongs);
} catch (error) {
  res.status(500).json({ error: "Failed to fetch Songs" });
}
});