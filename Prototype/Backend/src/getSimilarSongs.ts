import fetch from "node-fetch";
import { SimilarSongsResponse } from './types/SimilarSongsResponse';

export async function getSimilarSongs(requestURL: string): Promise<Array<string> | null> {
    try {
      const res = await fetch(requestURL, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      });
      const rawData = await res.json();
      const data = new SimilarSongsResponse(rawData as { 
        [sourceMbid: string]: { 
          "0": { recording_mbid: string }[]; 
        } 
      });
      let MBIDs : Array<string> = data.ToList();


      return MBIDs
      
    } catch (e) {
      if (e instanceof Error) {
      console.error("Failed to fetch Songs", e.message);
    }
    return null;
  }
  }