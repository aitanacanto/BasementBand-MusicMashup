import express, { Request, Response } from "express";
import fetch from "node-fetch";

export const SimilarityRouter = express.Router();

SimilarityRouter.get('/SimilarSongs/:MBID', async (req: Request, res: Response) => {
    let MBID : string = req.params.MBID;
    let NUM_RESULTS : number = 100;
    let metric : string = "key"
    let SimilarSongs : Array<JSON> | null;
    let requestURL = `https://acousticbrainz.org/api/v1/similarity/${metric}/?recording_ids=${MBID}&n_neighbours=${NUM_RESULTS}`
    
    try {
        SimilarSongs = await getSimilarSongs(requestURL);
        res.json({ SimilarSongs });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Songs" });
    }
});

async function getSimilarSongs(requestURL: string): Promise<Array<JSON> | null> {
    try {
      const res = await fetch(requestURL, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      });
      const data = await res.json() as Array<JSON>;
      return data ?? null;
      
    } catch (e) {
      if (e instanceof Error) {
        console.error("Failed to fetch Songs", e.message);
      }
      return null;
    }
  }
  
//   interface SongArray {
//     songs: { recording_mbid : string}[];
//   }