import React, { useState } from 'react';
import axios from 'axios';
import { Song } from '@/components/types/song';

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
      try {
        setLoading(true);
        setError('');

        const encodedTitle = encodeURIComponent(title);
        const encodedArtist = encodeURIComponent(artist);

        let songToPass: Song;

        try {
          const response = await axios.get(`http://localhost:50000/SimilarSongs/key/${encodedTitle}/${encodedArtist}`, {
            withCredentials: true
          });

          const similarSongs: Song[] = response.data;
          songToPass = (similarSongs && similarSongs.length > 0)
            ? similarSongs[0]
            : {
                mbid: '1',
                title: encodedTitle,
                artist: encodedArtist,
                key: 'A',
                key_scale: 'A',
                bpm: 100,
                genre: 'Any',
                danceability: 1,
                first_beat: 10,
                filepath: null,
                stems: null
              };
        } catch (fetchErr) {
          if (axios.isAxiosError(fetchErr) && fetchErr.response?.status === 404) {
            songToPass = {
              mbid: '1',
              title: encodedTitle,
              artist: encodedArtist,
              key: 'A',
              key_scale: 'A',
              bpm: 100,
              genre: 'Any',
              danceability: 1,
              first_beat: 10,
              filepath: null,
              stems: null
            };
          } else {
            throw fetchErr;
          }
        }

        const downloadRes = await axios.post(`http://localhost:50000/Download/`, songToPass, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const encodedPath = encodeURIComponent(downloadRes.data.filepath);
        const songUrl = `http://localhost:50000/GetFile/${encodedPath}`;
        console.log(songUrl);

        onAdd({ title, artist, url: songUrl });
        setTitle('');
        setArtist('');

      } catch (err) {
        console.error(err);
        setError('Error retrieving or downloading the song.');
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
