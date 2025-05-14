// src/components/SongSearch.tsx
import React, { useState } from 'react';

type Props = {
  onAdd: (song: { title: string; artist: string; youtubeId: string }) => void;
};

const SongSearch: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [youtubeId, setYoutubeId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && artist && youtubeId) {
      onAdd({ title, artist, youtubeId });
      setTitle('');
      setArtist('');
      setYoutubeId('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-white shadow rounded">
      <input className="p-2 border rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="p-2 border rounded" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
      <input className="p-2 border rounded" placeholder="YouTube ID" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Song</button>
    </form>
  );
};

export default SongSearch;
