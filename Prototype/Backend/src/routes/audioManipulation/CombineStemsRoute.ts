import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";
import { AlteredSong } from "../../types/AlteredStem";
import { combineStems } from "../../services/audioManipulation/combineStems";

export const CombineStemsRoute = express.Router();

/**
 * Pass an array containing each song you want to combine with the base song as the song at index 0
 * Alters all songs after index 0's stems to the origin songs statistics
 * TODO: Need the song durations 
*/
CombineStemsRoute.post('/Combine/', async (req: Request, res: Response) => {
    const songs = req.body as Array<Song>;
    if(songs.length <= 1){
        res.status(400).send("Must provide at least two different songs");
    }
    
    const base = songs[0];
    
    //Alter the base .wav then separate the stems for speed (at the cost of accuracy)
    //Attach altered stems to an altered song

    //Consider placing one stem folder in the raw folder and one in the altered
    //OR just disallow making raw stems due to the computational overhead


    for(let i = 1; i < songs.length; i ++){
        //Only once base has been trimmed of its silence and had its duration
        combineStems(base, songs[i]);
    }


});