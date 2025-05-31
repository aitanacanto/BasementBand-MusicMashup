import axios from 'axios';
import { MusicBrainzRecording } from '../../types/MusicBrainzRecording';

  export async function getRecordings(title: string, artist: string): Promise<Array<MusicBrainzRecording> | null> {
    const recordings : Array<MusicBrainzRecording> = [];
    try {
      const baseURL = "https://musicbrainz.org/ws/2/recording/?query=";
      let requestURL : string = `recording:${title} AND artist:${artist}`;

      const res = await axios.get(`${baseURL}${encodeURIComponent(requestURL)}&fmt=json`, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      });

      const data = res.data as MusicBrainzRecordingResponse;
  
      for (let i = 0; i < data.count; i++) {
        const recording_artist : string = data.recordings[i]?.['artist-credit']?.[0]?.artist?.name;
        const recording_title : string = data.recordings[i]?.title;
        const recording_release_id : string = data.recordings[i]?.id;
        //we only have enough requests to test 9 MBIDs because of the rate limiting
          if (i < 10 && recording_title.toLowerCase() === title.toLowerCase() && recording_artist.toLowerCase() === artist?.toLowerCase()) {
            recordings.push({
              title: recording_title,
              artist: recording_artist,
              MBID: recording_release_id
            });
          }
        
      };    
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
    return recordings;
  }

  interface MusicBrainzRecordingResponse {
    count: number
    recordings: { 
      id: string,
      title: string,
      "artist-credit": { 
        artist: { 
          id: string,
          name: string,
          "sort-name": string
        }
      }[]
      releases: {}[]
     }[];
  }