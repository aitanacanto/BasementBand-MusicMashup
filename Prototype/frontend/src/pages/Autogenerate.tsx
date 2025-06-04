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
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AutoGenerate: React.FC = () => {
  const [selectedSongs, setSelectedSongs] = useState<{ rootSong: Song; similarSongs: Song[] | null }[]>([]);
  const [trackedSongs, setTrackedSongs] = useState<Song[]>([]);
  const [multiTrackedSongs, setMultiTrackedSongs] = useState<Song[]>([]);
  const [cutTimeStamp, setCutTimeStamp] = useState<CutRange>({ timestamp1: null, timestamp2: null });
  const [alteredSongs, setAlteredSongs] = useState<Song[]>([]);
  const [displayMashup, setDisplayMashup] = useState<boolean>(false);
  const [mashupLoading, setMashupLoading] = useState<boolean>(false);

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
    setMashupLoading(true);
    const alteredRes = await axios.post(`http://localhost:50000/Combine/`, trackedSongs, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    setDisplayMashup(true);
    setMashupLoading(false);
    //have to make a fake song for each stem because I dont wanna mess with the multitrack code
    const copy = [...alteredSongs];
    for(let i = 0; i < alteredRes.data.length; i ++){
      for(let j = 0; j < alteredRes.data[i].stems.length; j ++){
        const fakeSong: Song = {
              mbid: '',
              title: alteredRes.data[i].stems[j].split("/")[4],
              artist: '',
              key: '',
              key_scale: '',
              bpm: 0,
              genre: '',
              danceability: 0,
              first_beat: 0,
              filepath: alteredRes.data[i].stems[j],
              stems: null
            };
            copy.push(fakeSong);
      }
    }
    setAlteredSongs(copy);
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
      {!displayMashup ? 
        <div>
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
            <Button onClick={handleMashup} className="mt-8 px-8 py-3 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-xl">
              {!mashupLoading ? "🚀 Create Mashup" : 
              <>
                <LoadingSpinner />
              </>
              }
            </Button>
          </motion.div>
        </div>
        :
        <div>
          {alteredSongs.map((song, idx) => (
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
      </div>}
  </motion.div>
  );
};

export default AutoGenerate;