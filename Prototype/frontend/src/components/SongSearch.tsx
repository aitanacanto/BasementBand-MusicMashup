// src/components/SongSearch.tsx
import React, { useState } from 'react';
import axios from 'axios';

type Props = {
  onAdd: (song: { title: string; artist: string; url: string }) => void;
};

const SongSearch: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    const encodedTitle = encodeURIComponent(title);
    const encodedArtist = encodeURIComponent(artist);

    try {
      setLoading(true);
      setError('');

      // Download song
      const downloadRes = await axios.get(
        `http://localhost:5000/Download/${encodedTitle}/${encodedArtist}`
      );

      const rawPath = downloadRes.data; //String Data

      // encodeURIComponent
      const encodedPath = encodeURIComponent(rawPath);

      // UrlSong
      const songUrl = `http://localhost:5000/GetFile/${encodedPath}`;

      onAdd({
        title,
        artist,
        url: songUrl,
      });

      setTitle('');
      setArtist('');
    } catch (err) {
      console.error(err);
      setError('Error downloading or retrieving the song.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-white shadow rounded">
      <input
        className="p-2 border rounded text-black"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="p-2 border rounded text-black"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Downloading...' : 'Add Song'}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default SongSearch;
