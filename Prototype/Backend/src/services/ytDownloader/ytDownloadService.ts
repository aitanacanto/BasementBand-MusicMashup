import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { MEDIA_FILE_PATH } from '../../Routes/utility/GetFileRoute';

export const downloadYoutubeAudio = async (songTitle: string, songArtist: string, folderPath: string): Promise<string | null> => {
    
    return new Promise<string>((resolve, reject) => {

        const queryString: string = songTitle.replace(/ /g, "+") + " " + songArtist.replace(/ /g, "+") + " Audio";
        //Puts query into the url format replacing spaces with +'s
        const command: string = "yt-dlp";
        const fileType = 'wav'

        //%(title) tells yt-dlp to name the file the song name.mp3
        //the output path is the relative path to the media folder
        const outputPath = path.posix.join(MEDIA_FILE_PATH, folderPath, `%(title)s.%(ext)s`);
        const args: string[] = [
            "-x",
            "--audio-format",
            "wav",
            "-o",
            outputPath,
            "--print-json",
            `ytsearch:${queryString}`,
        ];
        
        //Put query into youtubes url format
        const ytdlpProcess: ChildProcessWithoutNullStreams = spawn(command, args);

        let stderrOutput = '';
        let stdoutJson = ''; 

        //Reads the yt-dlp output to the console
        ytdlpProcess.stdout.on('data', (data: Buffer) => {
            stdoutJson += data.toString();
        });

        //Ouputs yt-dlp error log to console
        ytdlpProcess.stderr.on('data', (data: Buffer) => {
            stderrOutput += data.toString();
            console.error(`yt-dlp stderr: ${data.toString().trim()}`);
        });

        //Ouputs yt-dlp hard errors
        ytdlpProcess.on('error', (err: Error) => {
            console.error(`Failed to start yt-dlp process: ${err.message}`);
            reject(new Error(`Failed to start download process: ${err.message}`));
        });

        ytdlpProcess.on('exit', (code: number | null, signal: string | null) => {
            console.log(`yt-dlp process exited with code ${code} signal ${signal}`);
            if (code === 0) {
                try {
                    //We want to only pass the relative file path to the frontend
                    const videoInfo = JSON.parse(stdoutJson);
                    //extension is always .mp3
                    const relativeFolderPath = path.posix.join(folderPath, `${videoInfo?.fulltitle}.${fileType}`);
                    //Sends only the relative file path to be stored as a reference on the frontend and minimise information disclosure
                    resolve(relativeFolderPath);
                } catch (jsonError: any) {
                    // Handle errors during JSON parsing
                    console.error('Error parsing yt-dlp JSON output:', jsonError.message);
                    reject(new Error(`Download succeeded, but there was an error processing the download information.`));
                }
            } else {
                const errorReason = stderrOutput || `Process exited with code ${code}`;
                reject(new Error(`Download failed for "${songTitle}" by "${songArtist}": ${errorReason}`));
            }
        });
    });
}