import express, { Request, Response } from "express";
import path from "path";
import { Song } from "../../types/song";
import { cutAudio } from "../../services/audioManipulation/cut";
import { MEDIA_FILE_PATH } from "../..";

export const CutRoute = express.Router();


CutRoute.post('/Cut/:timestamp1/:timestamp2', async (req: Request, res: Response) => {
    //Pass the timestamp in seconds split away the decimal for file path reasons
    const timestamp1 = req.params.timestamp1.split('.')[0];
    const timestamp2 = req.params.timestamp2.split('.')[0];
    const song: Song = req.body as Song;
    const sessionId = (req as any).sessionId as string;
    const folderPath: string = path.posix.join(sessionId, "altered");
    if(sessionId){
        if(song.filepath){
            const songPath = path.posix.join(process.cwd(), MEDIA_FILE_PATH, song.filepath);
            const filepath: string | null = await cutAudio(timestamp1, timestamp2, folderPath, songPath);
            if(filepath){

                song.filepath = filepath;
                res.status(200).send(song);
            }
        }
    }
});