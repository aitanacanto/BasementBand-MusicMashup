import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { MEDIA_FILE_PATH } from '../../Routes/utility/GetFileRoute';
import { Song } from '../../types/song';

export const combineStems = async (baseSong: Song, otherSong: Song): Promise<string | null> => {
    return new Promise<string>((resolve, reject) => {
        const command: string = "rubberband";

        //Key steps:
        //1. All stems should have the same volume (roughly)
        //2. All stems should be the same tempo
        //4. Stems should have empty space trimmed from them first before anything else to ensure accuracy
        //This can be done with silenceDetect or the timestamp from musicbrainz
        //Possibly consider librosa for advanced audio analysis


        //

        //Check passed songs have stems with them
        if(baseSong.stems && otherSong.stems){

            const basePath = path.posix.join(MEDIA_FILE_PATH, baseSong.stems[0])
            const args: string[] = [
                ""
            ];
        }

        
    });
}