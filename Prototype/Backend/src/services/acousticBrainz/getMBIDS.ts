import axios from 'axios';
import { MusicBrainzRecording } from '../../types/MusicBrainzRecording';

  export async function getMBIDS(title: string, artist: string | null = null): Promise<Array<MusicBrainzRecording> | null> {
    const recordings : Array<MusicBrainzRecording> = [];
    try {
      const baseURL = "https://musicbrainz.org/ws/2/recording/?query=";
      let requestURL : string = `recording:${title}`;

      if (artist != null) {
        requestURL += ` AND artist:${artist}`;
      }

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
        if (artist?.toLowerCase() === recording_artist?.toLowerCase()) { 
          if (i > 4) {
            recordings.pop();
            recordings.unshift({
              title: recording_title,
              artist: recording_artist,
              MBID: recording_release_id
            })
            console.log("here");
            console.log(data.recordings[i]['artist-credit'][0])
            return recordings;
          }
        } else if (i <= 4) {
          recordings.push({
            title: recording_title,
            artist: recording_artist,
            MBID: recording_release_id
          });
        }
        
      };
      return recordings;
      
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
      return recordings;
    }
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