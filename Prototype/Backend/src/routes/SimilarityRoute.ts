// import express, { Request, Response, Router } from "express";

// export const SimilarityRouter = express.Router();

// SimilarityRouter.get('/SimilarSongs/:MBID', (req: Request, res: Response) => {
//     let MBID : string = req.params.MBID;
//     let SimilarSongs : Array<string> | null;
//     let requestURL = "";    //implement 
    
//     (async () => {
//         try {
//           SimilarSongs = await getSimilarSongs(requestURL);
//           res.json({ MBID });
//         } catch (error) {
//           res.status(500).json({ error: "Failed to fetch MusicBrainz ID" });
//         }
//       });
// });

// async function getSimilarSongs(requestURL: string): Promise<Array<string> | null> {
//     try {
//       const res = await fetch(requestURL, {
    //   headers: {
    //     "Accept": "application/json",
    //     "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
    //   }
    // });
//       const data = await res.json() as SongArray;
  
      
//     } catch (e) {
//       if (e instanceof Error) {
//         console.error("Failed to fetch MusicBrainz ID", e.message);
//       }
//       return null;
//     }
//   }
  
//   interface SongArray {
//     songs: { }[];
//   }