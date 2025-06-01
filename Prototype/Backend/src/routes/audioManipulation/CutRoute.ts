import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";
import { AlteredSong } from "../../types/AlteredSong";
import { combineStems } from "../../services/audioManipulation/combineStems";
import { MEDIA_FILE_PATH } from "../utility/GetFileRoute";
import { ChildProcessWithoutNullStreams } from "child_process";
import { spawn } from "child_process";
import { cutAudio } from "../../services/audioManipulation/cut";

export const CombineStemsRoute = express.Router();

/**
 * Pass an array containing each song you want to combine with the base song as the song at index 0
 * Alters all songs after index 0's stems to the origin songs statistics
 * TODO: Need the song durations 
*/
CombineStemsRoute.post('/Cut/:timestamp1/:timestamp2', async (req: Request, res: Response) => {
    //Pass the timestamp in seconds ( can be decimal )
    const timestamp1 = req.params.timestamp1;
    const timestamp2 = req.params.timestamp2;
    const song: Song = req.body as Song;
    const sessionId = (req as any).sessionId as string;
    const folderPath: string = path.posix.join(sessionId, "altered");
    const songPath = song.filepath;
       
    if(sessionId){
        if(songPath){
            const filepath: string | null = await cutAudio(timestamp1, timestamp2, folderPath, songPath);
            if(filepath){
                res.status(200).send(filepath);
            }
        }
    }
});