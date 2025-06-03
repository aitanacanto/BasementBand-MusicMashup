import express, { Request, Response } from "express";
import path from "path";
import { downloadYoutubeAudio } from "../../services/ytDownloader/ytDownloadService";
import { Song } from "../../types/song";
import { AlteredSong } from "../../types/AlteredSong";
import { MEDIA_FILE_PATH } from "../..";
import { ChildProcessWithoutNullStreams } from "child_process";
import { spawn } from "child_process";

export const timeStretch = (base: Song, other: Song, sessionId: string) => {
    return new Promise<Song>((resolve, reject) => {
        const command: string = "rubberband";
        //const outputPath = path.posix.join(folderPath, `${songTitle}:${timestamp1}-${timestamp2}.wav`);
        //const absoluteOutputPath = path.posix.join(process.cwd(), MEDIA_FILE_PATH, outputPath);
        if(other.filepath != null){
            const songPath = path.join(process.cwd(), MEDIA_FILE_PATH, other.filepath);
            const songTitle = path.parse(path.basename(songPath)).name;
            const bpm = base.bpm.toFixed(0);
            const outputPath = path.posix.join(sessionId, "altered", `${songTitle}-${bpm}.wav`);
            const absoluteOutputPath = path.posix.join(process.cwd(), MEDIA_FILE_PATH, outputPath)
            const args: string[] = [
                "--tempo",
                `${base.bpm}:${other.bpm}`,
                songPath,
                absoluteOutputPath
            ];
            console.log(base.bpm, songPath, absoluteOutputPath)
            const stretchProcess: ChildProcessWithoutNullStreams = spawn(command, args);
            let output: string = '';
            let errorOutput: string = '';

            stretchProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            stretchProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            stretchProcess.on('close', (code) => {
                if(code === 0){
                    console.log(output)
                } else {
                    console.log(output)
                }
            });

            stretchProcess.on('error', (err) => {
                console.log(output)
            });

            stretchProcess.on('exit', (code: number | null, signal: string | null) => {
                if (code === 0) {
                    other.filepath = outputPath;
                    other.bpm = base.bpm;
                    console.log(output, errorOutput)
                    resolve(other);
                } else {
                    console.log(errorOutput + "   **  " + code + "  :  " + signal)
                    reject(new Error(`${code}: ${signal}`));
                }
            });
        }
    }
)};


