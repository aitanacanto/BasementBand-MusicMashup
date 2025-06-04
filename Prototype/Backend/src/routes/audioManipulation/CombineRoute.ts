import express, { Request, Response } from "express";
import path, { normalize } from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";
import { AlteredSong } from "../../types/AlteredSong";
import { equalizeVolume } from "../../services/audioManipulation/equalizeVolume";
import { MEDIA_FILE_PATH } from "../..";
import { timeStretch } from "../../services/audioManipulation/timeStretch";
import { runDemucs } from "../../stemSeparation/stemSeparation";

export const CombineRoute = express.Router();

/**
 * Pass an array containing each song you want to combine with the base song as the song at index 0
 * Alters all songs after index 0's stems to the origin songs statistics
 * TODO: Need the song durations 
*/
CombineRoute.post('/Combine/', async (req: Request, res: Response) => {
    const USE_TIME_STRETCH = true;
    const EQUALIZE_VOLUME = false;
    
    const songs = req.body as Array<Song>;
    if(songs.length <= 1){
        res.status(400).send("Must provide at least two different songs");
    }
    const sessionId = (req as any).sessionId as string;
    const base = songs[0];
    if(sessionId){
        const alteredSongs: Song[] = [];

        //Also push base song while avoiding augmenting it earlier
        //We still want to stem separate it
        if(EQUALIZE_VOLUME){
            const equalizedBase: Song | null = await equalizeVolume(sessionId, base);
            if(equalizedBase) alteredSongs.push(equalizedBase);
        }
        else alteredSongs.push(base);
        
        for(let i = 1; i < songs.length; i ++){
            let huskSong: Song | null = songs[i];
            if(USE_TIME_STRETCH){
                huskSong = await timeStretch(base, songs[i], sessionId);
            }
            if(EQUALIZE_VOLUME){
                if(huskSong != null){
                    huskSong = await equalizeVolume(sessionId, huskSong);
                }
            }
            if(huskSong != null) alteredSongs.push(huskSong);
            else res.status(500).send("Failed to stretch provided song");
        }

        //Pass song file     
        for(let i = 0; i < alteredSongs.length; i ++){
            const songPath = songs[i].filepath;
            if(songPath != null){
                const absoluteSongPath: string = path.posix.join(process.cwd(), MEDIA_FILE_PATH, songPath);
                if(absoluteSongPath != null){
                    const outputDir = path.posix.join(sessionId, "stems");
                    const stems: Array<string> | null = await runDemucs(absoluteSongPath, outputDir);
                    if(stems != null){
                        alteredSongs[i].stems = stems;
                    }
                }
                else res.status(500).send("Song filepath wrong")
            }
            else res.status(500).send("Failed to separate songs stems")
        }
        res.send(alteredSongs);
    }
});