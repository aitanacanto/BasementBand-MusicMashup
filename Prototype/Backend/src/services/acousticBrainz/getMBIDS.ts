import axios from 'axios';
import { MusicBrainzRecording } from '../../types/MusicBrainzRecording';

  export async function getMBIDS(title: string, artist: string | null = null): Promise<Array<MusicBrainzRecording> | null> {
    const recordings : Array<MusicBrainzRecording> = [];
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
      console.log(data);
  
      for (let i = 0; i < data.count; i++) {
        let recording_artist : string;
        let recording_title : string;
        let recording_release_id : string;
        try {
          recording_artist = data.recordings[i]['artist-credit'][0].artist.name;
          recording_title = data.recordings[i].title
          recording_release_id = data.recordings[i].releases[0].id
        } catch (e) {
          if (e instanceof Error) {
            console.error(e.message);
          }
          continue;
        }
        
        if (artist?.toLowerCase() === recording_artist.toLowerCase()) { 
          if (i > 4) {
            recordings.pop();
            recordings.unshift({
              title: recording_title,
              artist: recording_artist,
              MBID: recording_release_id
            })
            break;
          }
        } else if (i <= 4) {
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
        artist: { name: string }
      }[]
      releases: {
        id: string
      }[]
     }[];
  }