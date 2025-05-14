export class SimilarSongsResponse {
    private data: {
      [sourceMbid: string]: {
        ["0"]: Array<{
          recording_mbid: string;
          distance: number; // still required in the type
          offset: number;   // still required in the type
        }>;
      };
    };
  
    constructor(data: {
      [sourceMbid: string]: {
        ["0"]: Array<{
          recording_mbid: string;
          distance: number;
          offset: number;
        }>;
      };
    }) {
      this.data = data;
    }
  
    ToList(): string[] {
      const sourceMbid = Object.keys(this.data)[0];
      const entries = this.data[sourceMbid]?.["0"];
      if (!Array.isArray(entries)) return [];
      return entries.map(item => item.recording_mbid); // ignore the rest
    }
  }
  