export class SimilarSongsResponse {
  private data: {
    [sourceMbid: string]: {
      ["0"]: Array<{
        recording_mbid: string;
      }>;
    };
  };

  constructor(data: {
    [sourceMbid: string]: {
      ["0"]: Array<{
        recording_mbid: string;
      }>;
    };
  }) {
    this.data = data;
  }

  ToList(): string[] {
    const sourceMbid : string = Object.keys(this.data)[0];
    const entries : Array<{ recording_mbid: string; }> = this.data[sourceMbid]?.["0"] ?? [];
    return entries.map(item => item.recording_mbid);
  }
}