import { downloadYoutubeAudio  } from './services/ytDownloadService';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { routes } from './routes';
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs'); // Import the file system module
const path = require('path');

//This extends the request object so we can easily access the users session id in all the routes

const app = express();

const sessions = new Map();

const COOKIE_NAME = 'userSessionId';

const MEDIA_FILE_PATH = "./media/"

const COOKIE_AGE = 20 * 60 * 1000;

const CLEAR_COOKIES_INTERVAL = 10 * 60 * 1000;
//20 minutes

const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use(cookieParser());

//This is executed before any route in this file
app.use((req, res, next) => {
    // Define the name of the cookie you want to use for the session ID
    let sessionId: string = req.cookies[COOKIE_NAME];
    const now = Date.now();

    //Checks the current cookies id:
    //1) Does not exist
    //2) is not in the sessions Map()
    //3) is expired 
    if (!sessionId || !sessions.has(sessionId) || sessions.get(sessionId) < now) {

        if (sessionId && (sessions.get(sessionId) < now || !sessions.has(sessionId))) {
            const userFilePath = path.join(MEDIA_FILE_PATH, sessionId);
   
            fs.rm(userFilePath, { recursive: true, force: true }, (error: string) => {
                if (error) {
                    console.error(`Error deleting expired user media directory ${userFilePath}: ${error}`);
                } else{
                    console.log(`Cleaned up expired user media directory: ${userFilePath}`);
                }
            });

            sessions.delete(userFilePath); 
       }


        sessionId = uuidv4(); 

        res.cookie(COOKIE_NAME, sessionId, { maxAge: COOKIE_AGE, httpOnly: true });
    
        sessions.set(sessionId, now + COOKIE_AGE)

        const userFilePath = path.join(MEDIA_FILE_PATH, sessionId);

        try{
            fs.mkdirSync(userFilePath, { recursive: true });
            console.log("Great, Success at: ", userFilePath)

        } catch(error){
            console.error("Error creating users directory");
            //return next(error);
            //for if we want to end session if the directory is not created
        }
    
        console.log(`New user connected. Created cookie with ID: ${sessionId}`);

    } else {
        //This code path means an active cookie was found
        //We want to refresh the cookie lifetime because the user is active 
        console.log(`Returning user with existing session ID: ${sessionId}`);

        sessions.set(sessionId, now + COOKIE_AGE);
    }
    //Progresses to the rest of the routes 
    next();
});

/**
 * Function to be run periodically.
 * Clears expired cookies from the  
*/
const cleanExpiredCookies = () => {
    const now = Date.now();
    let cleanedUpCount = 0;
    //Iterate through each entry in the map
    for (const [sessionId, expirationTimestamp] of sessions.entries()) {
        //If the cookie is expired
        if (expirationTimestamp < now) {
            const userFilePath = path.join(MEDIA_FILE_PATH, sessionId);
            //Remove users directory from the file system
            fs.rm(userFilePath, { recursive: true, force: true }, (error:string ) => {
                if (error) {
                    console.error(`Error deleting expired user media directory ${userFilePath}: ${error}`);
                } else if (!error) {
                    console.log(`Cleaned up expired user media directory: ${userFilePath}`);
                }
            });
            //Delete their session from the sessions map
            sessions.delete(sessionId);
            cleanedUpCount++;
            //The cookie itself will be autodeleted when it expires
        }
    }
    console.log(`Cleanup finished. Cleaned up ${cleanedUpCount} expired sessions.`);
}

setInterval(cleanExpiredCookies, CLEAR_COOKIES_INTERVAL);


app.get('/', (req: Request, res: Response) => {
    let sessionId: string  = req.cookies[COOKIE_NAME];
    if(sessionId){
        const userFilePath = path.join(MEDIA_FILE_PATH, sessionId);
        downloadYoutubeAudio("Enter Sandman", "Metallica", userFilePath);
    }
    res.json('This is the backend talking to the frontend');
});

/**
 * Downloads the audio as an mp3 for a given song and title 
 * Generates a random temporary directory to be used for 
 * songTitle: the title of the song
 * artist: the songs artist
*/
app.get('/download/', (req: Request, res: Response) => {
    let sessionId: string  = req.cookies[COOKIE_NAME];
    const userFilePath = path.join(MEDIA_FILE_PATH, sessionId);
    const songTitle: string = req.params.title;
    const artist: string = req.params.title;
    downloadYoutubeAudio(songTitle, artist, userFilePath);
});


app.use("/", routes);


app.get(/(.*)/, (req: Request, res: Response) => {
    res.status(404).send('<h1>404! Page not found</h1>');;
});
    
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
    console.log("to run on a different port, type 'PORT=<port number> npm run dev'");
});

export default app;




