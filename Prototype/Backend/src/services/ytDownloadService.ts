import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

export const downloadYoutubeAudio = (songTitle: string, songArtist: string, filePath: string) => {
    const queryString: string = songTitle.replace(/ /g, "+") + " " + songArtist.replace(/ /g, "+") + " Audio";
    //Puts query into the url format replacing spaces with +'s
    const command: string = "yt-dlp";

    const url: string = `https://www.youtube.com/results?search_query=${queryString}`;
    const outputPath = path.join(filePath, `%(title)s.%(ext)s`);
    const args: string[] = [
        "-x",
        "--audio-format",
        "mp3",
        "-o",
        outputPath,
        `ytsearch:${queryString}`,
    ];
    
    //Put query into youtubes url format
    const ytdlpProcess: ChildProcessWithoutNullStreams = spawn(command, args);

    ytdlpProcess.stderr.on('data', (data: Buffer) => {
        console.error(`yt-dlp stderr: ${data}`);
    });
    
}
