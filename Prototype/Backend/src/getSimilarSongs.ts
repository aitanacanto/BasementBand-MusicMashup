import fetch from "node-fetch";
import { SimilarSongsResponse } from './types/SimilarSongsResponse';
import { Song } from './types/song';
import { parseLowLevelResponseToSongs } from "./LowLevelResponse";

export async function getSimilarSongs(MBID: string, requestURL: string): Promise<Array<string> | null> {
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
          ["0"]: Array<{
            recording_mbid: string;
            distance: number;
            offset: number;
          }>;
        };
      });
      let mbids : Array<string> | null = data.ToList();
      mbids.unshift(MBID);
      const metric : string = "bpm";
      const songs : Array<Song> | null = await sortByMetric(mbids, metric);


      return mbids
      
    } catch (e) {
      if (e instanceof Error) {
      console.error("Failed to fetch Songs", e.message);
    }
    return null;
  }
}

async function sortByMetric(mbids : Array<string>, metric : string) : Promise<Array<Song> | null>{
    try {
      let requestURL : string = "https://acousticbrainz.org/api/v1/low-level?recording_ids=";
      mbids.forEach((mbid: string) => {
        requestURL += mbid + ";";
      });
      requestURL += "&features=metadata.tags;rhythm.bpm;tonal.key_key;tonal.key_scale;rhythm.danceability";
      const res = await fetch(requestURL, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      })
      const rawData = await res.json();
      const songs: Song[] = parseLowLevelResponseToSongs(rawData);
      console.log(songs);
      return songs;
      //CONTINUE HERE
      
    } catch (e) {
      if (e instanceof Error) {
      console.error("Failed to fetch Songs", e.message);
      }
      return null;
    }
  };

  //test url: https://acousticbrainz.org/api/v1/low-level?recording_ids=135bb9ed-9e90-42b8-8141-3225f63b9e59;1b5d1ee9-8589-4ab3-829c-cba496c75e3e;&features=metadata.tags;rhythm.bpm;tonal.key_key;tonal.key_scale"
