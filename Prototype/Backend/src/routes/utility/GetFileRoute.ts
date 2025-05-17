import express, { Request, Response } from "express";
import path from "path";
import fs from 'fs'; 

export const GetFileRoute = express.Router();


//Gets the absolute path to the media directory for use in the rest of the app
export const MEDIA_FILE_PATH: string = 'media';
//Gets the absolute path to the media folder
const ABSOLUTE_MEDIA_PATH = path.join(process.cwd(), MEDIA_FILE_PATH);


/**
 * Takes the relative path as the argument then attaches the absolute path and sends the file to the frontend
 */
GetFileRoute.get('/GetFile/:filepath', async (req: Request, res: Response) => {
    //const sessionId = req.params.sessionId;
    //const fileName = req.params.filename;
    const x = req.params.filepath;
    const filePath = path.join(ABSOLUTE_MEDIA_PATH, x);
    console.log(ABSOLUTE_MEDIA_PATH)
    console.log(x)
    console.log(filePath)
    if(filePath && fs.existsSync(filePath)){  
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Failed to send file to frontend', err);
            }
        });
    }
    else res.status(500).send("File not found");
});