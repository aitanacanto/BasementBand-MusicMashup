// AutoGenerate.tsx
import React, { useState, useEffect } from 'react';
import SongSearch from '@/components/SongSearch';
import SelectedSongs from '@/components/SelectedSongs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Song } from '@/components/types/song';
import MultiTrack from '@/components/MultiTrack';
import { CutRange } from '@/components/types/CutRange';
import axios from 'axios';
import WaveformPlayer from '@/components/WaveformPlayer';

const AutoGenerate: React.FC = () => {
  const [selectedSongs, setSelectedSongs] = useState<{ rootSong: Song; similarSongs: Song[] | null }[]>([]);
  const [trackedSongs, setTrackedSongs] = useState<Song[]>([]);
  const [multiTrackedSongs, setMultiTrackedSongs] = useState<Song[]>([]);
  const [cutTimeStamp, setCutTimeStamp] = useState<CutRange>({ timestamp1: null, timestamp2: null });

  const handleRemoveTrackedSong = (index: number) => {
    setTrackedSongs((prevTrackedSongs) => {
      const updatedTrackedSongs = [...prevTrackedSongs];
      updatedTrackedSongs.splice(index, 1);
      return updatedTrackedSongs;
    });
  };

  const handleAddToMultiTrack = (song: Song) => {
    const alreadyInList = multiTrackedSongs.some((s) => s.filepath === song.filepath);
    if (!alreadyInList) {
      setMultiTrackedSongs((prev) => [...prev, song]);
    }
  };

  const handleCutFinished = (cutSong: Song) => {
    handleAddToMultiTrack(cutSong);
  };

  const handleMashup = async () => {
    const alteredRes = await axios.post(`http://localhost:50000/Combine/`, trackedSongs, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    alteredRes.data.forEach((s: Song) => handleAddToMultiTrack(s));
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

      <SongSearch onAdd={(rootSong, similarSongs) => {
        if (selectedSongs.length < 5) {
          setSelectedSongs([...selectedSongs, { rootSong, similarSongs }]);
        }
      }} />

      <SelectedSongs
        songs={selectedSongs}
        setSongs={setSelectedSongs}
        trackedSongs={trackedSongs}
        setTrackedSongs={setTrackedSongs}
      />

      {trackedSongs.map((song, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.2 }}
        >
          <WaveformPlayer
            song={song}
            index={idx}
            onRemove={handleRemoveTrackedSong}
            onAddToMultiTrack={handleAddToMultiTrack}
            cutTimeStamp={cutTimeStamp}
            setCutTimeStamp={setCutTimeStamp}
            onCutFinished={handleCutFinished}
            onUpdateSong={(newSong) =>
              setTrackedSongs(prev =>
                prev.map((s, i) => i === idx ? newSong : s)
              )
            }
          />
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
