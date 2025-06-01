import { Request, Response, NextFunction } from 'express';
import { cleanExpiredCookies } from './sessionCleaner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
const cookieParser = require('cookie-parser');
import { MEDIA_FILE_PATH } from '../Routes/utility/GetFileRoute';

export const COOKIE_NAME: string = 'userSessionId';

const COOKIE_AGE: number = 120 * 60 * 1000; 
const CLEAR_COOKIES_INTERVAL: number = 30 * 60 * 1000; 
const CLEAR_COOKIES: boolean = false; 

const sessions = new Map<string, number>();

if (CLEAR_COOKIES) {
    setInterval(() => {cleanExpiredCookies}, CLEAR_COOKIES_INTERVAL);
}

export const sessionCookieHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies) {
        console.error("Error: cookie-parser middleware is not used before sessionMiddleware.");
        return next(new Error("cookie-parser middleware required")); 
    }

    let sessionId: string | undefined = req.cookies[COOKIE_NAME]; 

    const now = Date.now();
    const storedSessionExpiration = sessionId ? sessions.get(sessionId) : undefined;

    if (sessionId && storedSessionExpiration !== undefined && storedSessionExpiration >= now) {
        sessions.set(sessionId, now + COOKIE_AGE);

        //Sync browser cookie age with the value stored in the map
        res.cookie(COOKIE_NAME, sessionId, { maxAge: COOKIE_AGE, httpOnly: true });

    } else {
        if (sessionId && (storedSessionExpiration === undefined || storedSessionExpiration < now)) {
            console.log(`Attempting cleanup for invalid or expired session ID: ${sessionId}`);
            const expiredUserFilePath = path.posix.join(MEDIA_FILE_PATH, sessionId);

            fs.rm(expiredUserFilePath, { recursive: true, force: true }, (error) => {
                if (error) {
                    console.error(`Error deleting directory for invalid/expired session ${sessionId} at ${expiredUserFilePath}: ${error}`);
                } else {
                    console.log(`Cleaned up directory for invalid/expired session: ${sessionId}`);
                }
            });

            if (storedSessionExpiration !== undefined) {
                sessions.delete(sessionId);
            }
        }

        sessionId = uuidv4(); 
        //Creates new cookie
        res.cookie(COOKIE_NAME, sessionId, { maxAge: COOKIE_AGE, httpOnly: true });

        //Adding new cookie to the sessions map
        sessions.set(sessionId, now + COOKIE_AGE);

        const userFilePath = path.posix.join(MEDIA_FILE_PATH, sessionId);
        console.log("Dir: " + userFilePath)
        try {
            //Create user directory
            fs.mkdirSync(userFilePath, { recursive: true });
            //Subdirectories of user dir
            fs.mkdirSync(path.posix.join(userFilePath, "raw"), { recursive: true });
            fs.mkdirSync(path.posix.join(userFilePath, "stems"), { recursive: true });
            fs.mkdirSync(path.posix.join(userFilePath, "altered"), { recursive: true });

            console.log(`Success creating user directory structure for new session ${sessionId} at: ${userFilePath}`);

        } catch (error: any) {
            console.error(`Failed to create user directory structure for new session ${sessionId} at ${userFilePath}:`, error);
        }
        console.log(`New session created with ID: ${sessionId}`);
    }

    //This attaches the session id to the request object (standard practice for middleware)
    //No need to attach users filepath because their relative path is just the session id
    (req as any).sessionId = sessionId; 

    next();
};