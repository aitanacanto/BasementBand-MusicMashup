import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";
import { AlteredSong } from "../../types/AlteredSong";
import { combineStems } from "../../services/audioManipulation/combineStems";
import { MEDIA_FILE_PATH } from "../utility/GetFileRoute";
import { ChildProcessWithoutNullStreams } from "child_process";
import { spawn } from "child_process";

export const cutAudio = (timestamp1: string, timestamp2: string, songPath: string, folderPath: string) => {
    return new Promise<string>((resolve, reject) => {
        
        const command: string = "ffmpeg";

        const songTitle = path.parse(path.basename(songPath)).name;
        
        const outputPath = path.posix.join(MEDIA_FILE_PATH, folderPath, `${songTitle}:${timestamp1}-${timestamp2}.mp3`);

        const args: string[] = [
            command,
            "-i",
            songPath,
            "-ss",
            timestamp1,
            '-to',
            timestamp2,
            '-c:a',
            'copy',
            outputPath
        ];
        const cutProccess: ChildProcessWithoutNullStreams = spawn(command, args);

        cutProccess.on('exit', (code: number | null, signal: string | null) => {
            if (code === 0) {
                resolve(outputPath);
            } else {
                reject(new Error(`${code}: ${signal}`));
            }
        });
    }
)};


