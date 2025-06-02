import React, { useState, useEffect, useRef } from 'react';
import SongSearch from '@/components/SongSearch';
import SelectedSongs from '@/components/SelectedSongs';
import { Button } from '@/components/ui/button';
import WaveSurfer from 'wavesurfer.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Song } from '@/components/types/song';
import MultiTrack from '@/components/MultiTrack';
import { CutRange } from '@/components/types/CutRange';

const AutoGenerate: React.FC = () => {
  const [selectedSongs, setSelectedSongs] = useState<{ rootSong: Song; similarSongs: Song[] | null }[]>([]);
  const [trackedSongs, setTrackedSongs] = useState<Song[]>([]);
  const [multiTrackedSongs, setMultiTrackedSongs] = useState<Song[]>([]);
  const [waveformRefs, setWaveformRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);
  const [cutTimeStamp, setCutTimeStamp] = useState<CutRange>({timestamp1: null, timestamp2: null});
  const waves = useRef<WaveSurfer[]>([]);
  const playButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const handleAddSong = (rootSong: Song, similarSongs: Song[] | null) => {
    if (selectedSongs.length < 5) {
      setSelectedSongs([...selectedSongs, { rootSong, similarSongs }]);
    }
  };

  const handleRemoveSong = (index: number) => {
    const updated = [...selectedSongs];
    updated.splice(index, 1);
    setSelectedSongs(updated);
  };

  const handleRemoveTrackedSong = (index: number) => {
    const updated = [...trackedSongs];
    updated.splice(index, 1);
    setTrackedSongs(updated);
    waves.current[index]?.destroy();
    waves.current.splice(index, 1);
  };

  const handleAddToMultiTrack = (song: Song) => {
    const alreadyInList = multiTrackedSongs.some((s) => s.filepath === song.filepath);
    if (!alreadyInList) {
      setMultiTrackedSongs((prev) => [...prev, song]);
    }
  };

  const handleCut = async (song: Song, index: number) => {
    const wave = waves.current[index];
    if(!wave) return ;
    let timestamp = wave.getCurrentTime();
    if(cutTimeStamp.timestamp1){
      cutTimeStamp.timestamp2 = timestamp;
    }
    if(cutTimeStamp.timestamp1 && cutTimeStamp.timestamp2 && cutTimeStamp.timestamp1 < cutTimeStamp.timestamp2){
      const cutRes = await axios.post(`http://localhost:50000/Cut/${cutTimeStamp.timestamp1}/${cutTimeStamp.timestamp2}`, song, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      const cutSong: Song = cutRes.data;
      cutTimeStamp.timestamp1 = null;
      cutTimeStamp.timestamp2 = null;
      handleAddToMultiTrack(cutSong);
    }
    cutTimeStamp.timestamp1 = timestamp;
  }

  const handleMashup = async () => {
    //const wave = waves.current[index];
    console.log("Request Sent To mashup Songs")
    const alteredRes = await axios.post(`http://localhost:50000/Combine/`, trackedSongs, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });
    for(let i = 0; i < alteredRes.data.length; i ++){
      console.log(alteredRes.data[i]);
      handleAddToMultiTrack(alteredRes.data[i]);
    }
  }

  useEffect(() => {
    setWaveformRefs((prevRefs) =>
      Array(trackedSongs.length)
        .fill(null)
        .map((_, i) => prevRefs[i] || React.createRef())
    );
  }, [trackedSongs.length]);

  useEffect(() => {
    waves.current.forEach((w) => w.destroy());
    waves.current = [];
    loadWaveForms();
  }, [waveformRefs]);

  const loadWaveForms = async () => {
    for (const [idx, song] of trackedSongs.entries()) {
      const containerRef = waveformRefs[idx];
      if (!containerRef?.current) continue;

      const wave = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#a2d2ff',
        progressColor: '#0077b6',
        height: 80,
        responsive: true,
      });
      try {
        if(song.filepath){
          const response = await axios.get(`http://localhost:50000/GetFile/${encodeURIComponent(song.filepath)}`, {
            responseType: 'blob',
            withCredentials: true,
          });
          const audioBlob = response.data;
          wave.loadBlob(audioBlob);
        }
        
      } catch (err) {
        console.log(err);
      }
      waves.current.push(wave);

      wave.on('finish', () => {
        if (playButtons.current[idx]) playButtons.current[idx]!.textContent = 'Play';
      });
    }
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white space-y-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-6 text-center"
      >
        <h1 className="text-5xl font-extrabold text-white">🔁 MashGenX</h1>
        <p className="text-xl italic text-gray-300 mt-2">Generate your own mashup</p>
      </motion.div>

      <SongSearch onAdd={handleAddSong} />

      <SelectedSongs
        songs={selectedSongs}
        onRemove={handleRemoveSong}
        trackedSongs={trackedSongs}
        setTrackedSongs={setTrackedSongs}
      />

      {trackedSongs.map((song, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.2 }}
          className="track bg-white text-black rounded-2xl p-4 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-2">🎧 Audio Track {idx + 1} - {song.title}</h3>
          <div
            ref={waveformRefs[idx]}
            className="waveform w-full h-[100px] bg-gray-100 border border-gray-400"
          />
          <div className="flex gap-2 mt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              ref={(el) => (playButtons.current[idx] = el)}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              onClick={() => togglePlay(idx)}
            >
              Play
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              onClick={() => handleRemoveTrackedSong(idx)}
            >
              Remove ✖
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              onClick={() => handleAddToMultiTrack(song)}
            >
              MultiTrack ➕
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              onClick={() => handleCut(song, idx)}
            >
              Cut ✂️
            </motion.button>
          </div>
        </motion.div>
      ))}

      {multiTrackedSongs.length > 0 && <MultiTrack songs={multiTrackedSongs} />}

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Button onClick={handleMashup} className="mt-8 px-6 py-3 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-xl">
          🚀 Create Mashup
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AutoGenerate;
