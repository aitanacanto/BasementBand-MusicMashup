import React, { useState, useEffect, useRef } from 'react';
import SongSearch from '@/components/SongSearch';
import SelectedSongs from '@/components/SelectedSongs';
import { Button } from '@/components/ui/button';
import WaveSurfer from 'wavesurfer.js';

const AutoGenerate: React.FC = () => {
  const [selectedSongs, setSelectedSongs] = useState([
    { title: 'DtMF', url: 'songs/BadBunny-DtMF.mp3' },
    { title: 'Good Fealing', url: 'songs/FloRida-GoodFeeling.mp3' },
    { title: 'Bring Me To Life', url: 'songs/Creep-Radiohead.mp3' },
  ]);

  const waveformRefs = [useRef(null), useRef(null), useRef(null)];
  const waves = useRef<WaveSurfer[]>([]);
  const playButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const handleAddSong = (song: any) => {
    if (selectedSongs.length < 3) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleRemoveSong = (index: number) => {
    const updated = [...selectedSongs];
    updated.splice(index, 1);
    setSelectedSongs(updated);
  };

  useEffect(() => {
    waves.current.forEach((w) => w.destroy());
    waves.current = [];

    selectedSongs.forEach((song, idx) => {
      const wave = WaveSurfer.create({
        container: waveformRefs[idx].current!,
        waveColor: '#a2d2ff',
        progressColor: '#0077b6',
        height: 80,
        responsive: true,
      });

      wave.load(song.url);
      waves.current.push(wave);

      wave.on('finish', () => {
        if (playButtons.current[idx]) playButtons.current[idx]!.textContent = 'Play';
      });
    });
  }, [selectedSongs]);

  const togglePlay = (index: number) => {
    const wave = waves.current[index];
    const btn = playButtons.current[index];
    if (wave && btn) {
      if (wave.isPlaying()) {
        wave.pause();
        btn.textContent = 'Play';
      } else {
        wave.play();
        btn.textContent = 'Pause';
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white space-y-6">
      <h2 className="text-3xl font-bold">🔁 Auto Generate Mashup</h2>

      {/* Buscador de canciones por título/artista/YouTubeID */}
      <SongSearch onAdd={handleAddSong} />

      {/* Lista de canciones seleccionadas */}
      <SelectedSongs songs={selectedSongs} onRemove={handleRemoveSong} />

      {/* Visualización de Waveforms */}
      {selectedSongs.map((song, idx) => (
        <div key={idx} className="track bg-white text-black rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Audio Track {idx + 1}</h3>
          <div
            ref={waveformRefs[idx]}
            className="waveform w-full h-[100px] bg-gray-100 border border-gray-400"
          />
          <button
            ref={(el) => (playButtons.current[idx] = el)}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={() => togglePlay(idx)}
          >
            Play
          </button>
        </div>
      ))}

      {/* Botón para generar el mashup */}
      <Button className="mt-4">Generate Mashup</Button>
    </div>
  );
};

export default AutoGenerate;
