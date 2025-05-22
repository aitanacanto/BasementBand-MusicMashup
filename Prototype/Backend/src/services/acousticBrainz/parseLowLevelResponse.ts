import { Song } from "../../types/song";

export function parseLowLevelResponseToSongs(data: any): Song[] {
    const songs: Song[] = [];
  
    for (const mbid of Object.keys(data)) {
      const entry = data[mbid]?.["0"];
      if (!entry) continue;
  
      const tags = entry.metadata?.tags ?? {};
      const tonal = entry.tonal ?? {};
      const rhythm = entry.rhythm ?? {};
  
      songs.push({
        mbid,
        title: tags.title?.[0] ?? "Unknown Title",
        artist: tags.artist?.[0] ?? "Unknown Artist",
        key: tonal.key_key ?? "Unknown",
        key_scale: tonal.key_scale ?? "Unknown",
        bpm: rhythm.bpm ?? 0,
        genre: tags.genre?.[0] ?? "Unknown",
        danceability: rhythm.danceability?.toString() ?? "Unknown",
        first_beat: rhythm.beats_position?.[0],
        filepath: null,
        stems: []
      });
    }
  
    return songs;
  }