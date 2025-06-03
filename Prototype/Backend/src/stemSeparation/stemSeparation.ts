import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * Runs Demucs stem separation on a given local audio file.
 * Returns an array of output stem file paths, or null if none found.
 * @param audioFilePath Full path to the local audio file.
 * @param outputDir Target directory where separated stems should be saved.
 */
export async function runDemucs(audioFilePath: string, outputDir: string): Promise<string[] | null> {
  try {
    await fs.access(audioFilePath);
  } catch {
    throw new Error(`The provided file path does not exist: ${audioFilePath}`);
  }

  return new Promise((resolve, reject) => {
    const resolvedAudioPath = path.resolve(audioFilePath);
    const trackName = path.basename(audioFilePath, path.extname(audioFilePath)).replace(/[^a-zA-Z0-9-_]/g, '_');
    const modelName = "htdemucs"; // default model used by Demucs

    const demucsProcess = spawn("demucs", [
      "--out", outputDir,
      "--filename", `${trackName}/{stem}.wav`,
      resolvedAudioPath
    ]);

    demucsProcess.stdout.on("data", (data) => {
      console.log(`[demucs stdout]: ${data}`);
    });

    demucsProcess.stderr.on("data", (data) => {
      console.error(`[demucs stderr]: ${data}`);
    });

    demucsProcess.on("close", async (code) => {
      const outputFolder = path.join(outputDir, modelName, trackName);

      try {
        const files = await fs.readdir(outputFolder);
        console.log("Files in folder:", files);

        const stemFiles = ["vocals.wav", "drums.wav", "bass.wav", "other.wav"];
        const stems = stemFiles
          .filter(file => files.includes(file))
          .map(file => {
            const relativePath = path.join(path.basename(outputDir), modelName, trackName, file);
            return relativePath.replace(/\\/g, "/");
          });

        console.log("Final stems array:", stems);
        resolve(stems.length > 0 ? stems : null);
      } catch (err) {
        console.error("Cannot read output folder or stems:", err);
        resolve(null);
      }

      if (code !== 0) {
        reject(new Error(`Demucs exited with code ${code}`));
      }
    });
  });
}
