import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Song } from "../../types/song"
import { json } from "stream/consumers";
import { error } from "console";
import { LoudnormMeasuredStats } from "../../types/LoudnormMeasuredStats";
import path from "path";
import { MEDIA_FILE_PATH } from "../..";


export const equalizeVolume = async (baseSong: Song, otherSong: Song): Promise<string | null> => {
    
    //Integrated loudness (id kwaht this is but here is a constant)
    const I: number = -24
    const targetLRA: number = 7;
    const targetTP: number = -2;

    const runCommand = (args: Array<string>) => {
        return new Promise<string>((resolve, reject) => {
            const proccess: ChildProcessWithoutNullStreams = spawn("ffmpeg", args);
            let output: string = '';
            let errorOutput: string = '';

            proccess.stdout.on('data', (data) => {
                output += data.toString();
            });

            proccess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            proccess.on('close', (code) => {
                if(code === 0){
                    resolve(output);
                } else {
                    reject(new Error(`FFMPEG proccess failed with code: ${code} : ${errorOutput}`));
                }
            });

            proccess.on('error', (err) => {
                reject(new Error(`Failed to run FFMPEG proccess: ${err.message}`));
            });
        });
    }
    const analyseSongLoudness = async (filepath: string) => {
        const args = [
            '-i',
            filepath,
            '-af',
            'loudnorm=print_format=json',
            '-f', 
            'null',
            '-'
        ];

        try{
            const output: string = await runCommand(args);
            const jsonMatch: RegExpMatchArray | null = output.match(/\{[\s\S]*?\}/);
            if(jsonMatch){
                const jsonStr: string = jsonMatch[0];
                const loundnormStats: LoudnormMeasuredStats = JSON.parse(jsonStr);
                return loundnormStats;
            }
        }catch(err){
            console.error(err);
            throw error;
        }
    }

    /**
     * 
     * @param measuredStats The measured stats assosciated with the song passed
     * @param inputPath the file path of the song to be normalized
     */
    const applyNormalization = async (measuredStats: LoudnormMeasuredStats, inputPath: string) => {
        //Format arguments to 2 dp for ffmpeg
        const filterArgs : string = 
            `loudnorm=` + 
            `I=${I}:LRA=${targetLRA}:TP=${targetTP}:` +
            `measured_i=${parseFloat(measuredStats.input_i).toFixed(2)}:` +
            `measured_tp=${parseFloat(measuredStats.input_tp).toFixed(2)}:` + 
            `measured_lra=${parseFloat(measuredStats.input_lra).toFixed(2)}:` + 
            `measured_thresh=${parseFloat(measuredStats.input_thresh).toFixed(2)}:` +
            `linear=true`//Linear gain adjustment dont know what that means but is good aparantly
        
        const songTitle = path.parse(path.basename(inputPath)).name;
        const outputPath = path.join(MEDIA_FILE_PATH, "altered", `volNorm${songTitle}.wav`);
        const args: string[] = [
            '-i',
            inputPath,
            '-af',
            filterArgs,
            '-c:a',
            'pcm_s16le',
            outputPath
        ];

        try{
            await runCommand(args);
            console.log("Successfully ran normalization command for: " + inputPath);
        } catch(err){
            console.error("Failed to run normalization command" + err);
            throw error;
        }
    }

    return new Promise<string>(async (resolve, reject) => {
        if(baseSong.filepath != null && otherSong.filepath != null){
            const basePath: string = baseSong.filepath;
            const otherPath: string = otherSong.filepath;
            try{
                const [stats1, stats2] = await Promise.all([
                    analyseSongLoudness(basePath),
                    analyseSongLoudness(otherPath)
                ])
                if(stats1 && stats2){
                    await Promise.all([
                        applyNormalization(stats1, basePath),
                        applyNormalization(stats2, otherPath) 
                    ]);
                    resolve("Song volumes normalized");
                }
                else{
                    reject("Failed to analyse both songs");
                }

            } catch(err){
                console.error(err);
                reject(err);
            }
        }
        else reject("One or more provided filepaths are in the wrong format");
    })
}