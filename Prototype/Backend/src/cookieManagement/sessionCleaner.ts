import { MEDIA_FILE_PATH } from "../routes/utility/GetFileRoute";
import path from "path";
import fs from 'fs'; 


/**
 * Function to be run periodically.
 * Clears expired cookies from the  
*/
export const cleanExpiredCookies = (sessions: Map<string, number>) => {
    const now = Date.now();
    let cleanedCookies: number = 0;
    //Iterate through each entry in the map
    for (const [sessionId, expirationTimestamp] of sessions.entries()) {
        //If the cookie is expired
        if (expirationTimestamp < now) {
            const userFilePath = path.posix.join(MEDIA_FILE_PATH, sessionId);
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