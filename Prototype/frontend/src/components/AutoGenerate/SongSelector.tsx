
// src/components/AutoGenerate/SongSelector.tsx
import React from 'react';

const SongSelector: React.FC = () => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white">Select up to 4 songs to auto-generate a mashup</label>
      <input type="file" accept="audio/*" multiple className="block w-full text-sm text-white bg-gray-800 border border-gray-600 rounded-md p-2" />
    </div>
  );
};

export default SongSelector;