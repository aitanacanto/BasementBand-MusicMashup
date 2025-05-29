/**
 * Like song interface but used to assosciate combined stems with their origin properties
 * There is only a stems array because the filepaths assciated are the altered stems
 */
export interface AlteredSong {
    title: string,
    artist: string,
    key: string,
    key_scale: string,
    bpm: number,
    genre: string,
    danceability: number,
    first_beat: number
    stems: Array<string> | null
}