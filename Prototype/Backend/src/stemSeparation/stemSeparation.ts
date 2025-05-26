import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * Runs Demucs stem separation on a given local audio file.
 * Returns an array of output stem file paths, or null if none found.
 * @param audioFilePath Full path to the local audio file.
 */
export async function runDemucs(audioFilePath: string): Promise<string[] | null> {
  // 1. Check if the input audio file exists.
  try {
    await fs.access(audioFilePath);
  } catch {
    // If the file doesn't exist, throw an error and stop.
    throw new Error(`The provided file path does not exist: ${audioFilePath}`);
  }

  // 2. Run Demucs using the child_process.spawn function.
  //    Demucs will process the audio file and output stems in a folder.
  return new Promise((resolve, reject) => {
    // Start the Demucs process with the audio file as argument.
    const demucsProcess = spawn("demucs", [audioFilePath]);

    // Listen for any output from Demucs and print it to the console.
    demucsProcess.stdout.on("data", (data) => {
      console.log(`[demucs stdout]: ${data}`);
    });

    // Listen for any error output from Demucs and print it to the console.
    demucsProcess.stderr.on("data", (data) => {
      console.error(`[demucs stderr]: ${data}`);
    });

    // When Demucs finishes, this event fires.
    demucsProcess.on("close", async (code) => {
      // If Demucs finished successfully (exit code 0)...
      if (code === 0) {
        // 3. Build the path to the output folder where Demucs puts the stems.
        //    The folder is usually: separated/htdemucs/<songname>/
        const outputFolder = path.join(
          "separated",
          "htdemucs",
          path.basename(audioFilePath, path.extname(audioFilePath))
        );

        // 4. List all expected stem filenames.
        const stemFiles = [
          "vocals.wav",
          "drums.wav",
          "bass.wav",
          "other.wav",
        ];

        // 5. Prepare an array to hold the full paths of the stem files that exist.
        const stems: string[] = [];

        // 6. For each expected stem file, check if it exists in the output folder.
        for (const fileName of stemFiles) {
          const stemPath = path.join(outputFolder, fileName);
          try {
            // If the stem file exists, add its path to the stems array.
            await fs.access(stemPath);
            stems.push(stemPath);
          } catch {
            // If the file doesn't exist, skip it (don't add to the array).
          }
        }

        // 7. If at least one stem was found, resolve with the array.
        //    Otherwise, resolve with null.
        resolve(stems.length > 0 ? stems : null);
      } else {
        // If Demucs failed (non-zero exit code), reject with an error.
        reject(new Error(`Demucs exited with code ${code}`));
      }
    });
  });
}
