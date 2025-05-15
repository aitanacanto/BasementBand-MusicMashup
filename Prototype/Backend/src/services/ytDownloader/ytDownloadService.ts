import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { MEDIA_FILE_PATH } from '../..';

export const downloadYoutubeAudio = async (songTitle: string, songArtist: string, folderPath: string): Promise<string | null> => {
    
    return new Promise<string>((resolve, reject) => {
        const queryString: string = songTitle.replace(/ /g, "+") + " " + songArtist.replace(/ /g, "+") + " Audio";
        //Puts query into the url format replacing spaces with +'s
        const command: string = "yt-dlp";

        const url: string = `https://www.youtube.com/results?search_query=${queryString}`;
        //%(title) talls yt-dlp to name the file the song name.mp3
        const outputPath = path.join(folderPath, `%(title)s.%(ext)s`);
        const args: string[] = [
            "-x",
            "--audio-format",
            "mp3",
            "-o",
            outputPath,
            "--print-json",
            `ytsearch:${queryString}`,
        ];
        
        //Put query into youtubes url format
        const ytdlpProcess: ChildProcessWithoutNullStreams = spawn(command, args);

        let stderrOutput = '';
        let stdoutJson = ''; 

        ytdlpProcess.stdout.on('data', (data: Buffer) => {
            // When using --print-json, the entire JSON object is typically printed to stdout
            // before or after the download process output. We'll collect all stdout data.
            stdoutJson += data.toString();
            // You might still want to log this for debugging, but be mindful it could be large JSON
            // console.log(`yt-dlp stdout data chunk: ${data.toString().trim()}`);
        });

        ytdlpProcess.stderr.on('data', (data: Buffer) => {
            stderrOutput += data.toString();
            console.error(`yt-dlp stderr: ${data.toString().trim()}`); // stderr often has progress updates and errors
        });

        ytdlpProcess.on('error', (err: Error) => {
            console.error(`Failed to start yt-dlp process: ${err.message}`);
            reject(new Error(`Failed to start download process: ${err.message}`));
        });

        ytdlpProcess.on('exit', (code: number | null, signal: string | null) => {
            console.log(`yt-dlp process exited with code ${code} signal ${signal}`);
            if (code === 0) {
                try {
                    // Attempt to parse the collected stdout as JSON
                    const videoInfo = JSON.parse(stdoutJson);
                    // The final file path is usually available in the JSON output
                    // Look for a field like 'filepath' or '_filepath'.
                    // The exact field name might depend on yt-dlp version and options,
                    // but 'filepath' or '_filepath' is common for the downloaded file.
                    const absoluteFilePath = path.join(folderPath, `${videoInfo?.track}.mp3`) ;
                    //const finalFilePath = videoInfo.filepath || videoInfo._filepath; // Use _filepath if filepath is not present
                    console.log(absoluteFilePath)
                    resolve(absoluteFilePath);
                    //if (finalFilePath) {
                        //console.log(`Successfully parsed final file path from JSON: ${finalFilePath}`);
                        // Resolve the promise waith the captured final file path (which should be absolute)
                        //Promise.resolve(finalFilePath);
                    //} else {
                        //console.warn("yt-dlp succeeded, but could not find the file path in the JSON output.");
                        // Reject or resolve with a different status if path not found in JSON
                        //Promise.reject(new Error("Download succeeded, but the final file path could not be found in the JSON output."));
                    //}
                } catch (jsonError: any) {
                    // Handle errors during JSON parsing
                    console.error('Error parsing yt-dlp JSON output:', jsonError.message);
                    reject(new Error(`Download succeeded, but there was an error processing the download information.`));
                }
            } else {
                // Process exited with an error code
                const errorReason = stderrOutput || `Process exited with code ${code}`;
                reject(new Error(`Download failed for "${songTitle}" by "${songArtist}": ${errorReason}`));
            }
        });
    });
}