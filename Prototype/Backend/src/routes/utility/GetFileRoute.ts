import express, { Request, Response } from "express";
import path from "path";
import fs from 'fs'; 

export const GetFileRoute = express.Router();

//Gets the absolute path to the media directory for use in the rest of the app
export const MEDIA_FILE_PATH: string = 'media';
//Gets the absolute path to the media folder
const ABSOLUTE_MEDIA_PATH = path.posix.join(process.cwd(), MEDIA_FILE_PATH);

/**
 * Takes the relative path as the argument then attaches the absolute path and sends the file to the frontend
 * This allows the frontend to store files by storing their file path strings
 * The frontend needs to encode the filepath before sending them in the request uri
 */
GetFileRoute.get('/GetFile/:filepath', async (req: Request, res: Response) => {
    const filePath =  path.posix.join(ABSOLUTE_MEDIA_PATH, decodeURI(req.params.filepath));
    //Posix (/ instead of \) is required to prevent issues with encoding/decoding the filepath
    if(filePath && fs.existsSync(filePath)){  
        try{
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Failed to send file to frontend', err);
                }
            });
        }catch(error){
            console.log(error);
        }
    }
    else res.status(500).send("File not found");
});