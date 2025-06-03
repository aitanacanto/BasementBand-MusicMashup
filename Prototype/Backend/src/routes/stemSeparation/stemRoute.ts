import express from "express";
import { runDemucs } from "../../stemSeparation/stemSeparation";
import { Song } from "../../types/song";
import path from "path";
import { MEDIA_FILE_PATH } from "../..";

export const StemRoute = express.Router();

StemRoute.post("/run-demucs",async (req, res) => {
  const song: Song = req.body;

  try {
    if (!song.filepath) {
       res.status(400).json({ error: "No filepath provided in song object." });
       return
    }
    const absoluteSongPath = path.join(process.cwd(), MEDIA_FILE_PATH, song.filepath);
    const stems = await runDemucs(absoluteSongPath);
    const updatedSong: Song = {
      ...song,
      stems
    };

    res.json(updatedSong);
  } catch (error: any) {
    console.error("Error running Demucs:", error);
    res.status(500).json({ error: "Failed to run Demucs stem separation." });
  }
});

export default StemRoute;