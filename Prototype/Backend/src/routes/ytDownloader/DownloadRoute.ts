import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { COOKIE_NAME, MEDIA_FILE_PATH } from "../..";
import fs from 'fs'; 

export const DownloadRoute = express.Router();

/**
 * Downloads the audio as an mp3 for a given song and title 
 * Generates a random temporary directory to be used for 
 * songTitle: the title of the song
 * artist: the songs artist
*/
DownloadRoute.get('/Download/:title/:artist', async (req: Request, res: Response) => {
    let sessionId: string  = req.cookies[COOKIE_NAME];
    //Can only access the downloads route if there is an active session + id
    if(sessionId){
        try{
            const userFilePath: string = path.join(MEDIA_FILE_PATH, sessionId);
            const songTitle: string = req.params.title;
            const artist: string = req.params.artist;
            //Both artist and song title are required by this route because musicbrainz provides artist given the song title
            if (!songTitle || !artist) {
                res.status(400).send({ message: 'Missing song title or artist' });
            }
            const filePath: string | null = await downloadYoutubeAudio(songTitle, artist, userFilePath)
            //Checks that file path is not null (downloadYoutubeAudio completed correctly)
            //Returneed file path = base path + mp3 name
            
            if(filePath && fs.existsSync(filePath)){
                res.sendFile(filePath, (err) => {
                    if (err) {
                        console.error('Failed to send file to frontend', err);
                    }
                });
            }
            else {
                res.status(500).send({ message: `Filepath does not exist ${filePath}`});
            }
        } catch (error: any){
            console.log(`Failed to download: ${error.message}`)
            res.status(500).send({message: `Failed to download: ${error.message}`})
        }
    }

    
});