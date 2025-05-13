import React from 'react';

type Song = {
  title: string;
  artist: string;
  youtubeId: string;
};

type Props = {
  songs: Song[];
  onRemove: (index: number) => void;
};

const SelectedSongs: React.FC<Props> = ({ songs, onRemove }) => {
  return (
    <div className="bg-gray-800 p-4 rounded shadow text-white">
      <h3 className="text-xl font-semibold mb-3">🎵 Selected Songs</h3>

      {songs.length === 0 && (
        <p className="text-sm text-gray-400">No songs selected yet.</p>
      )}

      <ul className="space-y-2">
        {songs.map((song, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-700 p-3 rounded"
          >
            <div>
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-gray-300">{song.artist}</p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-600 text-sm font-semibold"
            >
              Remove ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedSongs;
