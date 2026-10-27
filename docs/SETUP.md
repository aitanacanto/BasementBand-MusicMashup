# Local setup

## Applications and prerequisites

| Component | Requirement |
| --- | --- |
| Frontend | Node.js 20 or newer, npm, React and Vite dependencies from its lockfile. |
| Backend | Node.js, npm and TypeScript dependencies from its own lockfile. |
| Downloads | yt-dlp and FFmpeg available on PATH. |
| Clip processing | FFmpeg for cuts; Rubber Band for tempo adjustment. |
| Stem separation | Python, Demucs and its PyTorch dependencies, with the `demucs` executable on PATH. |

The original project instructions used Node.js 20.19.1. The presentation review generated the frontend build using Node.js 24.22.1. A later runtime does not guarantee compatibility of all Python and native audio dependencies.

The interface can be viewed without installing the audio tools. Their installation is separate from `npm ci`; Demucs may download model data when first used.

## 1. Install the locked dependencies

Run each block from the repository root in a separate terminal:

```sh
cd Prototype/frontend
npm ci
```

```sh
cd Prototype/Backend
npm ci
```

Each application has its own package manifest and lockfile. Keep the directory spelling as tracked: `Backend`, `frontend`, and `src/routes`.

## 2. View the interface

From `Prototype/frontend`:

```sh
npm run dev
```

Vite normally starts at `http://localhost:5173`. Use the address printed in the terminal. The welcome page is `/`; the editor is `/autogenerate`.

The current frontend contains backend URLs fixed at `http://localhost:50000`. Opening the interface on another Vite port may also require a code change to the backend's CORS allowlist; this documentation update does not make that change. If a port is occupied, identify its owner before choosing how to proceed.

## 3. Backend entry point

The backend manifest defines:

```sh
cd Prototype/Backend
npm run dev
```

Its source selects `process.env.PORT` or **50000**, and permits the frontend origin **http://localhost:5173**. The earlier README's ports 3000 and 5000 do not match the current Vite frontend and backend source.

**The original backend currently reports TypeScript casing diagnostics involving imports of `Routes` and the tracked `routes` directory.** Its development command can therefore stop before startup. The source has been preserved; the documentation does not imply those errors have been repaired.

`npm run build` invokes TypeScript, but the current configuration does not define an output directory. The `start` command expects `dist/index.js`. These scripts need a separate code/configuration review before relying on a production launch.

## 4. Audio tools

Check executable discovery before trying an audio operation:

```powershell
Get-Command yt-dlp, ffmpeg, rubberband, demucs
```

Use the projects' installation instructions for your system:

- [yt-dlp](https://github.com/yt-dlp/yt-dlp#installation)
- [FFmpeg](https://ffmpeg.org/download.html)
- [Rubber Band](https://breakfastquay.com/rubberband/)
- [Demucs](https://github.com/facebookresearch/demucs)

Only use source audio you are authorised to process. Session media, downloaded tracks and generated outputs are local runtime data and excluded from the repository.

## External metadata

The prototype calls MusicBrainz for recording identifiers and AcousticBrainz for musical features and similar recordings. Those calls require internet access and a matching recording in the available data. [AcousticBrainz states](https://acousticbrainz.org/) that data collection ended in 2022 while its website and API remain available. That statement does not guarantee that every endpoint or requested recording will return a usable result.

## Validation boundaries

| Check | Result of the presentation review |
| --- | --- |
| Original frontend Vite build | Passed using the existing dependency lockfile. |
| Original welcome page and editor | Rendered locally; captured without browser page errors. |
| Frontend TypeScript check | Existing diagnostics: component props, nullable file path, WaveSurfer option/type compatibility and filename casing. |
| Backend TypeScript check | Existing diagnostics involving `Routes` versus `routes`. |
| Populated mixer capture | Isolated visual fixture with synthetic WAV files, using the original components. |
| Online discovery, downloads and Demucs | Not validated end to end during this review. |
| Application changes | No TypeScript, TSX, JavaScript, package manifest or lockfile changes in this presentation update. |

The `build` script runs Vite and does not run the separate TypeScript check. A Vite build can therefore succeed while `npx tsc --noEmit` reports errors. No automated application test suite is claimed by this documentation.
