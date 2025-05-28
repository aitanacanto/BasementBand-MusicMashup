export interface Song {
    mbid: string,
    title: string,
    artist: string,
    key: string,
    key_scale: string,
    bpm: number,
    genre: string,
    danceability: number,
    first_beat: number
    filepath: null | string
    stems: Array<string> | null
}