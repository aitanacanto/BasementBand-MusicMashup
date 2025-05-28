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

    //const encodedTitle = encodeURIComponent(title);
    //const encodedArtist = encodeURIComponent(artist);
    //No need to encode these for passing an object

    try {
      setLoading(true);
      setError('');

      //Temporary to maintain functionality:
      //Assign title and artist to song object and pass to download route
      //In future the frontend should be sending this title and artist to acoustic brainz info first then sending
      //The filled out song object to the download route
      const songToPass: any = {
        mbid: '1',
        title: encodeURIComponent(title), 
        artist: encodeURIComponent(artist), 
        key: 'A', 
        key_scale: 'A', 
        bpm: 100, 
        genre: 'Any', 
        dancebility: 1, 
        first_beat: 10, 
        filepath: null, 
        stems: null
      }

      // Download song
      const downloadRes = await axios.post(
        `http://localhost:50000/Download/`,
        songToPass,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const rawPath = downloadRes.data.filepath; //String Data

      // encodeURIComponent
      console.log("RawPath:", rawPath)
      const encodedPath = encodeURIComponent(rawPath);
      console.log("Encoded Path:", encodedPath)
      

      // UrlSong
      const songUrl = `http://localhost:50000/GetFile/${encodedPath}`;

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
