import express, { Request, Response } from "express";
import { getSimilarSongs } from "../../services/acousticBrainz/getSimilarSongs";
import { Song } from "../../types/song";
import { MusicBrainzRecording } from "../../types/MusicBrainzRecording";
import { getRecordings } from "../../services/acousticBrainz/getRecordings";

export const SimilarityRouter = express.Router();

SimilarityRouter.get('/SimilarSongs/:metric/:title/:artist', async (req: Request, res: Response) => {
  let NUM_RESULTS : number = 24;  //24 neighbours each time as low level batch request only takes 25 MBIDs, and we need to include the original.
  let metric : string = req.params.metric;
  let title : string = req.params.title;
  let artist : string = req.params.artist;
  let recordings : Array<MusicBrainzRecording> | null;

  try {
    recordings = await getRecordings(title, artist);
    if (!recordings || recordings.length === 0) {
      res.status(404).json({ error: "No matches found." });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "Error 500: Failed to fetch MusicBrainz IDs" });
    return;
  }

  let SimilarSongs : Array<Song> | null;

  //test each MBID till we find one that returns a valid similar songs result
  for (const recording of recordings) {
    const MBID : string = recording.MBID;
    let requestURL = 
      `https://acousticbrainz.org/api/v1/similarity/${metric}/?recording_ids=${MBID}&n_neighbours=${NUM_RESULTS}`
    console.log(requestURL);

    try {
      SimilarSongs = await getSimilarSongs(MBID, requestURL);
      if (!SimilarSongs || SimilarSongs.length === 0) {
        continue;
      } else {
        res.send(SimilarSongs);
        return;
      }
    } catch (error) {
      continue;
    }
  }
  res.send(null);
});