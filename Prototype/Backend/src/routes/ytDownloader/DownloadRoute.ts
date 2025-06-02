import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";

export const DownloadRoute = express.Router();

/**
 * Downloads the audio as an mp3 for a given song and title 
 * Generates a random temporary directory to be used for 
 * songTitle: the title of the song
 * artist: the songs artist
*/
DownloadRoute.post('/', async (req: Request, res: Response) => {
    //Derive session id and user file path from the modified request object
    const sessionId = (req as any).sessionId as string;

    const song = req.body as Song;
    //Access the user filepath if they have a valid session
    console.log(song)
    try{
        
        if(sessionId){
            try{
                //Passes the relative path 
                //Posix uses / instead of \ which is necesary 
                const downloadFolderpath: string = path.posix.join(sessionId, "raw");
                const songTitle: string = song.title;
                const artist: string = song.artist;
                //Both artist and song title are required by this route because musicbrainz provides artist given the song title
                if (!songTitle || !artist) {
                    res.status(400).send({ message: 'Missing song title or artist' });
                }
                const filePath: string | null = await downloadYoutubeAudio(songTitle, artist, downloadFolderpath)
                //Checks that file path is not null (downloadYoutubeAudio completed correctly)
                //Attaches the downloaded songs filepath to the song object and returns it to the frontend
                if(filePath) {
                    song.filepath = filePath;
                    res.send(song);
                }
                else {
                    res.status(500).send({ message: `Filepath does not exist ${filePath}`});
                }
            } catch (error: any){
                console.log(`Failed to download: ${error.message}`)
                res.status(500).send({message: `Failed to download: ${error.message}`})
            }
        }
    } catch(err){
        res.status(400).send(err);
    }
});