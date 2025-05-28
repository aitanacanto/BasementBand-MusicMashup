import React, { useState } from 'react';
import { Song } from '@/components/types/song';
import axios from 'axios';

type Props = {
  songs: { rootSong: Song; similarSongs: Song[] | null }[];
  onRemove: (index: number) => void;
  trackedSongs: Song[];
  setTrackedSongs: React.Dispatch<React.SetStateAction<Song[]>>;
};

const SelectedSongs: React.FC<Props> = ({ songs, onRemove, trackedSongs, setTrackedSongs }) => {


  const handleAddTrack = async (song: Song) => {
    try {
      const downloadRes = await axios.post(`http://localhost:50000/Download/`, song, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const encodedPath = encodeURIComponent(downloadRes.data.filepath);
      const songUrl = `http://localhost:50000/GetFile/${encodedPath}`;
      song.filepath = songUrl;

      setTrackedSongs((prev) => [...prev, song]);
    } catch (error) {
      console.error("Error downloading track:", error);
      alert("Error downloading the track.");
    }
  };


  const showInfo = (song: Song) => {
    alert(`Title: ${song.title}\nArtist: ${song.artist}`);
  };

  const [showModal, setShowModal] = useState(false);
  const [currentSimilar, setCurrentSimilar] = useState<Song[]>([]);

  const showSimilarSongs = (index: number) => {
    const similar = songs[index].similarSongs;
    if (!similar || similar.length === 0) {
      alert('No similar songs available.');
      return;
    }
    setCurrentSimilar(similar);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow text-white">
      <h3 className="text-xl font-semibold mb-3">🎵 Selected Songs</h3>

      {songs.length === 0 && (
        <p className="text-sm text-gray-400">No songs selected yet.</p>
      )}

      <ul className="space-y-2">
        {songs.map((entry, index) => (
          <li
            key={index}
            className="flex flex-col gap-2 bg-gray-700 p-3 rounded"
          >
            <div className="flex items-center gap-2 text-white text-lg font-semibold">
              <span className="truncate max-w-[60%]">{entry.rootSong.title}</span>
              <span className="text-gray-300 text-base font-medium italic truncate max-w-[40%]">
                — {entry.rootSong.artist}
              </span>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => onRemove(index)}
                className="flex-1 text-red-400 hover:text-red-600 text-base font-semibold py-2 bg-gray-800 rounded"
              >
                Remove ✖
              </button>
              <button
                onClick={() => handleAddTrack(entry.rootSong)}
                className="flex-1 text-green-400 hover:text-green-600 text-base font-semibold py-2 bg-gray-800 rounded"
              >
                Add Track ➕
              </button>
              <button
                onClick={() => showInfo(entry.rootSong)}
                className="flex-1 text-blue-400 hover:text-blue-600 text-base font-semibold py-2 bg-gray-800 rounded"
              >
                Song Info ℹ️
              </button>
              <button
                onClick={() => showSimilarSongs(index)}
                className="flex-1 text-yellow-400 hover:text-yellow-600 text-base font-semibold py-2 bg-gray-800 rounded"
              >
                Similar 🎶
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-black">
            <h2 className="text-xl font-semibold mb-4">🎶 Similar Songs</h2>
            <ul className="space-y-4 max-h-80 overflow-y-auto">
              {currentSimilar.map((s, i) => (
                <li key={i} className="border-b pb-2">
                  <p className="font-semibold">{s.title} — <span className="italic text-gray-600">{s.artist}</span></p>
                  <div className="flex gap-4 mt-1">
                    <button
                      onClick={() => handleAddTrack(s)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Add Track
                    </button>
                    <button
                      onClick={() => showInfo(s)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                    >
                      Show Info
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedSongs;