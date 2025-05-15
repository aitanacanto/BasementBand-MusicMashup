import express, { Request, Response } from 'express';
import cors from 'cors';
import { routes } from './routes';
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
import fs from 'fs'; 
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

const sessions = new Map();

export const COOKIE_NAME: string = 'userSessionId';

//export const MEDIA_FILE_PATH: string = "./media/"
export const MEDIA_FILE_PATH: string = path.join(process.cwd(), 'media');
const COOKIE_AGE: number = 20 * 60 * 1000;
//Cookie Age is 20 minutes
const CLEAR_COOKIES_INTERVAL: number = 20 * 60 * 1000;
//Clearing cookies every 20 minutes 
const CLEAR_COOKIES: boolean = true;

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Current issue:
// Creating new session for every new connection
//Subdirectories not being created (probably not using async properly)


//This is executed before any route in this file (Middleware)
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
   
            fs.rm(userFilePath, { recursive: true, force: true }, (error) => {
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

        //Creating the users file under their session id
        try{
            //Dir creations as of now
            //media/id /raw /stems /altered
            fs.mkdirSync(userFilePath, { recursive: true });
            fs.mkdirSync(userFilePath.join("/raw"), { recursive: true });
            fs.mkdirSync(userFilePath.join("/stems"), { recursive: true });
            fs.mkdirSync(userFilePath.join("/altered"), { recursive: true });
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
        //This extends the users cookie by another 20 minutes if they connect to the backend with an existing cookie (they are active)
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
    let cleanedCookies: number = 0;
    //Iterate through each entry in the map
    for (const [sessionId, expirationTimestamp] of sessions.entries()) {
        //If the cookie is expired
        if (expirationTimestamp < now) {
            const userFilePath = path.join(MEDIA_FILE_PATH, sessionId);
            //Remove users directory from the file system
            fs.rm(userFilePath, { recursive: true, force: true }, (error) => {
                if (error) {
                    console.error(`Error deleting expired user media directory ${userFilePath}: ${error}`);
                } else if (!error) {
                    console.log(`Cleaned up expired user media directory: ${userFilePath}`);
                }
            });
            //Delete their session from the sessions map
            sessions.delete(sessionId);
            cleanedCookies++;
            //The cookie itself will be autodeleted when it expires
        }
    }
    console.log(`Cleanup finished. Cleaned up ${cleanedCookies} expired sessions.`);
}

//If cookie clearing is enabled this will check for and remove expired cookies and folders at the set interval
if(CLEAR_COOKIES){
    setInterval(cleanExpiredCookies, CLEAR_COOKIES_INTERVAL);
}

app.use("/", routes);

app.get(/(.*)/, (req: Request, res: Response) => {
    res.status(404).send('<h1>404! Page not found</h1>');;
});
    
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
    console.log("to run on a different port, type 'PORT=<port number> npm run dev'");
});

export default app;




