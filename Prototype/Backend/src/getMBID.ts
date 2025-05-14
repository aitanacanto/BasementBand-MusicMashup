import fetch from "node-fetch";

export async function getMBID(title: string, artist: string | null = null): Promise<string | null> {
    try {
      const baseURL = "https://musicbrainz.org/ws/2/recording/?query=";
      let requestURL : string = `recording:${title}`;

      if (artist != null) {
        requestURL.concat(` AND artist:${artist}`);
      }

      const res = await fetch(`${baseURL}${encodeURIComponent(requestURL)}&fmt=json`, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Music_Mashup_project/1.0.0 (frankiechristie314@gmail.com)" //musicbrainz requires a user agent identifier in case of issues
        }
      });

      const data = await res.json() as MusicBrainzRecording;
  
      return data.recordings[0].id ?? null;
      
    } catch (e) {
      if (e instanceof Error) {
        console.error("Failed to fetch MusicBrainz ID", e.message);
      }
      return null;
    }
  }

  interface MusicBrainzRecording {
    recordings: { id: string }[];
  }