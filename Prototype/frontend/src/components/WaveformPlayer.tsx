// WaveformPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import axios from 'axios';
import { Song } from '@/components/types/song';
import { CutRange } from '@/components/types/CutRange';

interface Props {
  song: Song;
  index: number;
  onRemove: (index: number) => void;
  onAddToMultiTrack: (song: Song) => void;
  cutTimeStamp: CutRange;
  setCutTimeStamp: React.Dispatch<React.SetStateAction<CutRange>>;
  onCutFinished: (cutSong: Song) => void;
  onUpdateSong: (song: Song) => void;
}

const WaveformPlayer: React.FC<Props> = ({
  song,
  index,
  onRemove,
  onAddToMultiTrack,
  cutTimeStamp,
  setCutTimeStamp,
  onCutFinished,
  onUpdateSong,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#a2d2ff',
        progressColor: '#0077b6',
        height: 80,
        responsive: true,
      });

      waveSurfer.current.on('ready', () => setIsReady(true));
      waveSurfer.current.on('finish', () => setIsPlaying(false));

      const fetchAndLoad = async () => {
        try {
          const response = await axios.get(`http://localhost:50000/GetFile/${encodeURIComponent(song.filepath)}`, {
            responseType: 'blob',
            withCredentials: true,
          });

          waveSurfer.current?.loadBlob(response.data);
          console.log('FilePath:', song.filepath);

          const res = await axios.post('http://localhost:50000/api/stem/run-demucs', song, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          });
          const updatedSong: Song = res.data;

          if (updatedSong.stems != null) {
            for (const s of updatedSong.stems) {
              console.log("Stem:", s);
            }
            onUpdateSong(updatedSong);
          } else {
            console.log("JODETE 5");
          }

        } catch (error) {
          console.error('Error in fetchAndLoad or Demucs:', error);
        }
      };

      fetchAndLoad();
    }

    return () => {
      waveSurfer.current?.destroy();
    };
  }, [song.filepath]);

  const togglePlay = () => {
    if (waveSurfer.current && isReady) {
      waveSurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleCut = async () => {
    if (!waveSurfer.current) return;
    const timestamp = waveSurfer.current.getCurrentTime();

    if (cutTimeStamp.timestamp1) {
      const newCutRange = { timestamp1: cutTimeStamp.timestamp1, timestamp2: timestamp };
      if (newCutRange.timestamp1 < newCutRange.timestamp2) {
        try {
          const response = await axios.post(`http://localhost:50000/Cut/${newCutRange.timestamp1}/${newCutRange.timestamp2}`, song, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          });
          const cutSong: Song = response.data;
          onCutFinished(cutSong);
        } catch (error) {
          console.error('Cut error:', error);
        }
      }
      setCutTimeStamp({ timestamp1: null, timestamp2: null });
    } else {
      setCutTimeStamp({ timestamp1: timestamp, timestamp2: null });
    }
  };

  return (
    <div className="bg-white text-black rounded-2xl p-4 shadow-lg space-y-2">
      <h3 className="text-lg font-semibold">🎧 Audio Track {index + 1} - {song.title}</h3>
      <div ref={waveformRef} className="waveform w-full h-[100px] bg-gray-100 border border-gray-400" />
      <div className="flex gap-2 mt-2">
        <button onClick={togglePlay} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => onRemove(index)} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
          Remove ✖
        </button>
        <button onClick={() => onAddToMultiTrack(song)} className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-600 text-sm">
          MultiTrack ➕
        </button>
        <button onClick={handleCut} className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-600 text-sm">
          Cut ✂️
        </button>
      </div>
      <div>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-300 transition-colors duration-200"
        >
          ▸ Stems
        </button>
        {showDropdown && (
          <div className="mt-2 border border-gray-300 p-2 rounded bg-gray-50 text-sm text-gray-600">
            {/* Placeholder for stem content */}
            (Empty for now)
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveformPlayer;