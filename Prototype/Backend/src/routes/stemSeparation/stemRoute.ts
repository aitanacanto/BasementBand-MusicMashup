import express from "express";
import { runDemucs } from "../../stemSeparation/stemSeparation";
import { Song } from "../../types/song";
import path from "path";
import { MEDIA_FILE_PATH } from "../..";

export const StemRoute = express.Router();

StemRoute.post("/run-demucs", async (req, res) => {
  const song: Song = req.body;

  try {
    if (!song.filepath) {
      res.status(400).json({ error: "No filepath provided in song object." });
      return;
    }

    const sessionId = (req as any).sessionId as string;
    if (!sessionId) {
      res.status(400).json({ error: "No session ID provided." });
      return;
    }

    const absoluteSongPath = path.posix.join(process.cwd(), MEDIA_FILE_PATH, song.filepath);

    const outputDir = path.posix.join(sessionId, "stems");

    const stems = await runDemucs(absoluteSongPath, outputDir);

    const updatedSong: Song = {
      ...song,
      stems,
    };

    res.json(updatedSong);
  } catch (error: any) {
    console.error("Error running Demucs:", error);
    res.status(500).json({ error: "Failed to run Demucs stem separation." });
  }
});

export default StemRoute;
