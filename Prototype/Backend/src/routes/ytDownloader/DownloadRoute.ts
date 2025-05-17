import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import fs from 'fs'; 
import { MEDIA_FILE_PATH } from "../..";

export const DownloadRoute = express.Router();

/**
 * Downloads the audio as an mp3 for a given song and title 
 * Generates a random temporary directory to be used for 
 * songTitle: the title of the song
 * artist: the songs artist
*/
DownloadRoute.get('/Download/:title/:artist', async (req: Request, res: Response) => {
    //Derive session id and user file path from the modified request object
    const sessionId = (req as any).sessionId as string;
    //Access the user filepath if they have a valid session
    if(sessionId){
        try{
            //Passes the relative path 
            const downloadFolderpath: string = path.join(sessionId, "raw");
            const songTitle: string = req.params.title;
            const artist: string = req.params.artist;
            //Both artist and song title are required by this route because musicbrainz provides artist given the song title
            if (!songTitle || !artist) {
                res.status(400).send({ message: 'Missing song title or artist' });
            }
            const filePath: string | null = await downloadYoutubeAudio(songTitle, artist, downloadFolderpath)
            //Checks that file path is not null (downloadYoutubeAudio completed correctly)
            //Sends the downloaded file's filepath to the frontend
            if(filePath) res.send(filePath);
            else {
                res.status(500).send({ message: `Filepath does not exist ${filePath}`});
            }
        } catch (error: any){
            console.log(`Failed to download: ${error.message}`)
            res.status(500).send({message: `Failed to download: ${error.message}`})
        }
    }
});