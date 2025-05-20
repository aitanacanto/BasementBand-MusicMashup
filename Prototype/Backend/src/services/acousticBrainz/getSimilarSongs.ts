import axios from 'axios';
import { SimilarSongsResponse } from '../../types/SimilarSongsResponse';
import { Song } from '../../types/song';
import { parseLowLevelResponseToSongs } from "./parseLowLevelResponse";

export async function getSimilarSongs(MBID: string, requestURL: string): Promise<Array<Song> | null> {
    try {
      const res = await axios.get(requestURL, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      });
      const data = new SimilarSongsResponse(res.data as { 
        [sourceMbid: string]: {
          ["0"]: Array<{
            recording_mbid: string;
            distance: number;
            offset: number;
          }>;
        };
      });
      let mbids : Array<string> | null = data.ToList();
      mbids.unshift(MBID);  //add original song's MBID to the start of the list
      const songs : Array<Song> | null = await getSongData(mbids);
      if (songs === null) {
        return null;
      }
      songs.sort((a, b) => b.bpm - a.bpm);

      return songs
      
    } catch (e) {
      if (e instanceof Error) {
      console.error("Failed to fetch Songs", e.message);
    }
    return null;
  }
}

async function getSongData(mbids : Array<string>) : Promise<Array<Song> | null>{
    try {
      let requestURL : string = "https://acousticbrainz.org/api/v1/low-level?recording_ids=";
      mbids.forEach((mbid: string) => {
        requestURL += mbid + ";";
      });
      const res = await axios.get(requestURL, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      })
      const songs: Song[] = parseLowLevelResponseToSongs(res.data);
      return songs;
      
    } catch (e) {
      if (e instanceof Error) {
      console.error("Failed to fetch Songs", e.message);
      }
      return null;
    }
  };

  
