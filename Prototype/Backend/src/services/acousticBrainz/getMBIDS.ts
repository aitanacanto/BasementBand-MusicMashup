import axios from 'axios';
import { MusicBrainzRecording } from '../../types/MusicBrainzRecording';

export async function getMBIDS(title: string, artist: string | null = null): Promise<Array<MusicBrainzRecording> | null> {
    try {
      const baseURL = "https://musicbrainz.org/ws/2/recording/?query=";
      let requestURL : string = `recording:${title}`;

      if (artist != null) {
        requestURL.concat(` AND artist:${artist}`);
      }

      const res = await axios.get(`${baseURL}${encodeURIComponent(requestURL)}&fmt=json`, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      });

      const data = res.data as MusicBrainzRecordingResponse;
  
      const recordings : Array<MusicBrainzRecording> = [];
        for (let i = 0; i < 5; i++) {
          if (i >= data.count) {
            break;
          };
          recordings.push({
            title: data.recordings[i].title,
            artist: data.recordings[i]['artist-credit'][0].artist.name,
            MBID: data.recordings[i].id
          });
        };
      return recordings;
      
    } catch (e) {
      if (e instanceof Error) {
        console.error("Failed to fetch MusicBrainz ID", e.message);
      }
      return null;
    }
  }

  interface MusicBrainzRecordingResponse {
    count: number
    recordings: { 
      id: string,
      title: string,
      "artist-credit": { 
        artist: { name: string }
      }[]
     }[];
  }