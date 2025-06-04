// WaveformPlayer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [stemPlayers, setStemPlayers] = useState<(WaveSurfer | null)[]>([]);
  const stemContainerRefs = useRef<{ [index: number]: HTMLDivElement | null }>({});

  const setStemContainerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stemContainerRefs.current[index] = el;
    },
    []
  );

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
        } catch (error) {
          console.error('Error loading main waveform:', error);
        }
      };

      fetchAndLoad();
    }

    return () => {
      waveSurfer.current?.destroy();
      waveSurfer.current = null;
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
          const response = await axios.post(
            `http://localhost:50000/Cut/${newCutRange.timestamp1}/${newCutRange.timestamp2}`,
            song,
            {
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' },
            }
          );
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

  const handleCutGeneric = async (player: WaveSurfer | null, filepath: string) => {
    if (!player) return;
    const timestamp = player.getCurrentTime();

    if (cutTimeStamp.timestamp1) {
      const newCutRange = { timestamp1: cutTimeStamp.timestamp1, timestamp2: timestamp };
      if (newCutRange.timestamp1 < newCutRange.timestamp2) {
        try {
          const response = await axios.post(
            `http://localhost:50000/Cut/${newCutRange.timestamp1}/${newCutRange.timestamp2}`,
            { ...song, filepath },
            {
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' },
            }
          );
          const cutSong: Song = response.data;
          onCutFinished(cutSong);
        } catch (error) {
          console.error('Stem cut error:', error);
        }
      }
      setCutTimeStamp({ timestamp1: null, timestamp2: null });
    } else {
      setCutTimeStamp({ timestamp1: timestamp, timestamp2: null });
    }
  };

  useEffect(() => {
    const loadStems = async () => {
      if (!song.stems) return;

      const newPlayers: (WaveSurfer | null)[] = [];

      for (let i = 0; i < song.stems.length; i++) {
        const container = stemContainerRefs.current[i];
        if (!container) continue;

        const ws = WaveSurfer.create({
          container,
          waveColor: '#f59e0b',
          progressColor: '#b45309',
          height: 40,
          responsive: true,
        });

        try {
          const res = await axios.get(`http://localhost:50000/GetFile/${encodeURIComponent(song.stems[i])}`, {
            responseType: 'blob',
            withCredentials: true,
          });
          ws.loadBlob(res.data);
          newPlayers[i] = ws;
        } catch (err) {
          console.error(`Error loading stem ${i}:`, err);
          ws.destroy();
          newPlayers[i] = null;
        }
      }

      setStemPlayers(newPlayers);
    };

    loadStems();
    return () => {
      stemPlayers.forEach(p => p?.destroy());
    };
  }, [song.stems]);

  return (
    <div className="bg-white text-black rounded-2xl p-4 shadow-lg space-y-2">
      <h3 className="text-lg font-semibold">🎧 Audio Track {index + 1} - {song.title}</h3>
      <div ref={waveformRef} className="w-full h-[100px] bg-gray-100 border border-gray-400" />

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

      {song.stems && song.stems.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-gray-300 pt-4">
          {song.stems.map((stemPath, idx) => (
            <div key={`${stemPath}-${idx}`} className="text-xs space-y-1">
              <p className="font-semibold">{stemPath.split('/').pop()}</p>
              <div ref={setStemContainerRef(idx)} className="w-full h-[40px] bg-gray-200 rounded" />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const player = stemPlayers[idx];
                    if (player?.isPlaying()) {
                      player.pause();
                    } else {
                      player?.play();
                    }
                  }}
                  className="text-xs px-2 py-1 bg-blue-400 text-white rounded"
                >
                  Play / Pause
                </button>

                <button
                  onClick={() => {
                    const fakeSong: Song = {
                      mbid: '',
                      title: `Stem ${idx + 1}`,
                      artist: song.artist || '',
                      key: '',
                      key_scale: '',
                      bpm: song.bpm || 0,
                      genre: '',
                      danceability: 0,
                      first_beat: 0,
                      filepath: stemPath,
                      stems: null,
                    };
                    onAddToMultiTrack(fakeSong);
                  }}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded"
                >
                  Add Multitrack
                </button>

                <button
                  onClick={() => handleCutGeneric(stemPlayers[idx], stemPath)}
                  className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Cut ✂️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaveformPlayer;