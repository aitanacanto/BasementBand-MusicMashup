import React, { useState } from 'react';
import axios from 'axios';
import { Song } from '@/components/types/song';

type Props = {
  onAdd: (rootSong: Song, similarSongs: Song[] | null) => void;
};

const SongSearch: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    try {
      setLoading(true);
      setError('');

      const encodedTitle = encodeURIComponent(title);
      const encodedArtist = encodeURIComponent(artist);

      const response = await axios.get(
        `http://localhost:50000/SimilarSongs/key/${encodedTitle}/${encodedArtist}`,
        { withCredentials: true }
      );

      const similarSongs: Song[] = response.data;

      if (Array.isArray(similarSongs) && similarSongs.length > 0) {
        const rootSong = similarSongs[0];
        const rest = similarSongs.slice(1);
        onAdd(rootSong, rest);
      } else {
        throw new Error('Empty array');
      }

      setTitle('');
      setArtist('');
    } catch (err) {
      console.error(err);

      const fallbackRoot: Song = {
        mbid: '',
        title: title,
        artist: artist,
        key: '',
        key_scale: '',
        bpm: 0,
        genre: '',
        danceability: 0,
        first_beat: 0,
        filepath: null,
        stems: null
      };

      onAdd(fallbackRoot, null);
      setError('No similar songs found.');
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
        {loading ? 'Searching...' : 'Add Song'}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default SongSearch;
