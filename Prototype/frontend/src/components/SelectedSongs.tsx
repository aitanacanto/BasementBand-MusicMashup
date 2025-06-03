// SelectedSongs.tsx
import React, { useState } from 'react';
import { Song } from '@/components/types/song';
import axios from 'axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Props = {
  songs: { rootSong: Song; similarSongs: Song[] | null }[];
  setSongs: React.Dispatch<React.SetStateAction<{ rootSong: Song; similarSongs: Song[] | null }[]>>;
  trackedSongs: Song[];
  setTrackedSongs: React.Dispatch<React.SetStateAction<Song[]>>;
};

const SelectedSongs: React.FC<Props> = ({ songs, setSongs, trackedSongs, setTrackedSongs }) => {
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSimilar, setCurrentSimilar] = useState<Song[]>([]);
  const [currentInfoTrack, setCurrentInfoTrack] = useState<Song>();
  const [modalType, setModalType] = useState<'similar' | 'info' | null>(null);

  const handleRemove = (index: number) => {
    const updated = [...songs];
    updated.splice(index, 1);
    setSongs(updated);
  };

  const handleAddTrack = async (song: Song, index: number) => {
    try {
      setLoadingIndexes((prev) => [...prev, index]);

      const downloadRes = await axios.post(`http://localhost:50000/Download/`, song, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      song.filepath = downloadRes.data.filepath;

      setTrackedSongs((prev) => [...prev, song]);
    } catch (error) {
      console.error("Error downloading track:", error);
      alert("Error downloading the track.");
    } finally {
      setLoadingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  const showInfo = (song: Song) => {
    setModalType('info');
    setCurrentInfoTrack(song);
    setShowModal(true);
  };

  const showSimilarSongs = (index: number) => {
    const similar = songs[index].similarSongs;
    if (!similar || similar.length === 0) {
      alert('No similar songs available.');
      return;
    }
    setCurrentSimilar(similar);
    setModalType('similar');
    setShowModal(true);
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow text-white">
      <h3 className="text-xl font-semibold mb-3">🎵 Selected Songs</h3>

      {songs.length === 0 && <p className="text-sm text-gray-400">No songs selected yet.</p>}

      <ul className="space-y-2">
        {songs.map((entry, index) => (
          <li key={index} className="flex flex-col gap-2 bg-gray-700 p-3 rounded">
            <div className="flex items-center gap-2 text-white text-lg font-semibold">
              <span className="truncate max-w-[60%]">{entry.rootSong.title}</span>
              <span className="text-gray-300 text-base font-medium italic truncate max-w-[40%]">— {entry.rootSong.artist}</span>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleRemove(index)}
                className="flex-1 text-red-400 hover:text-red-600 text-base font-semibold py-2 bg-gray-800 rounded"
              >
                Remove ✖
              </button>

              <button
                onClick={() => handleAddTrack(entry.rootSong, index)}
                disabled={loadingIndexes.includes(index)}
                className={`flex-1 text-base font-semibold py-2 rounded bg-gray-800 ${
                  loadingIndexes.includes(index)
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-green-400 hover:text-green-600'
                }`}
              >
                {loadingIndexes.includes(index) ? (
                  <span className="flex items-center justify-center gap-2">
                    <>
                      <LoadingSpinner />
                      Loading...
                    </>
                  </span>
                ) : (
                  'Add Track ➕'
                )}
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
            {modalType === 'similar' && (
              <>
                <h2 className="text-xl font-semibold mb-4">🎶 Similar Songs</h2>
                <ul className="space-y-4 max-h-80 overflow-y-auto">
                  {currentSimilar.map((s, i) => (
                    <li key={i} className="border-b pb-2">
                      <p className="font-semibold">{s.title} — <span className="italic text-gray-600">{s.artist}</span></p>
                      <div className="flex gap-4 mt-1">
                        <button
                          onClick={() => handleAddTrack(s, i)}
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
              </>
            )}

            {modalType === 'info' && currentInfoTrack && (
              <>
                <h2 className="text-xl font-semibold mb-4">ℹ️ Track Info</h2>
                <p><strong>Title:</strong> {currentInfoTrack.title}</p>
                <p><strong>Artist:</strong> {currentInfoTrack.artist}</p>
                <p><strong>Genre:</strong> {currentInfoTrack.genre || '-'}</p>
                <p><strong>Key:</strong> {(currentInfoTrack.key + " " + currentInfoTrack.key_scale).trim() || '-'}</p>
                <p><strong>Bpm:</strong> {currentInfoTrack.bpm !== 0 ? currentInfoTrack.bpm.toFixed() : '-'}</p>
                <p><strong>Danceability:</strong> {Number(currentInfoTrack.danceability) !== 0 ? Number(currentInfoTrack.danceability).toFixed(2) : '-'}</p>
              </>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                setModalType(null);
              }}
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