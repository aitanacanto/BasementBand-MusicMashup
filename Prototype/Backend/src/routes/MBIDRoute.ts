import express, { Request, Response } from "express";
import fetch from "node-fetch";


export const MBIDRoute = express.Router();

MBIDRoute.get('/MBID/:title/:artist', async (req: Request, res: Response) => {
  let title : string = req.params.title;
  let artist : string = req.params.artist;
  let requestURL : string = `https://musicbrainz.org/ws/2/recording/?query=recording:${title}%20AND%20artist:${artist}`;
  let MBID : string | null;

  try {
    MBID = await getMBID(requestURL);
    res.json({ MBID });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MusicBrainz ID" });
  }
});

async function getMBID(requestURL: string): Promise<string | null> {
  try {
    const res = await fetch(requestURL, {
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