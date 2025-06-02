import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";
import { AlteredSong } from "../../types/AlteredSong";
import { combineStems } from "../../services/audioManipulation/combineStems";
import { MEDIA_FILE_PATH } from "../..";
import { ChildProcessWithoutNullStreams } from "child_process";
import { spawn } from "child_process";

export const cutAudio = (timestamp1: string, timestamp2: string, folderPath: string, songPath: string) => {
    return new Promise<string>((resolve, reject) => {
        
        const command: string = "ffmpeg";

        const songTitle = path.parse(path.basename(songPath)).name;
        
        const outputPath = path.posix.join(folderPath, `${songTitle}:${timestamp1}-${timestamp2}.wav`);
        const absoluteOutputPath = path.posix.join(process.cwd(), MEDIA_FILE_PATH, outputPath);
        
        console.log(`songpath: ${songPath}, timestamp1: ${timestamp1}, timestamp2: ${timestamp2}, outputPath: ${outputPath}`)
        const args: string[] = [
            "-i",
            songPath,
            "-ss",
            timestamp1,
            '-to',
            timestamp2,
            '-c:a',
            'copy',
            absoluteOutputPath,
        ];
        const cutProccess: ChildProcessWithoutNullStreams = spawn(command, args);

        let output: string = '';
            let errorOutput: string = '';

            cutProccess.stdout.on('data', (data) => {
                output += data.toString();
            });

            cutProccess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            cutProccess.on('close', (code) => {
                if(code === 0){
                    console.log(output)
                } else {
                    console.log(output)
                }
            });

            cutProccess.on('error', (err) => {
                console.log(output)
            });

        cutProccess.on('exit', (code: number | null, signal: string | null) => {
            if (code === 0) {
                resolve(outputPath);
            } else {
                console.log(errorOutput + "   **  " + code + "  :  " + signal)
                reject(new Error(`${code}: ${signal}`));
            }
        });
    }
)};


