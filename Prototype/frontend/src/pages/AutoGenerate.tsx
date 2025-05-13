// src/pages/AutoGenerate.tsx
import React from 'react';
import SongSelector from '@/components/AutoGenerate/SongSelector';
import { Button } from '@/components/ui/button';

const AutoGenerate: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">🔁 Auto Generate Mashup</h2>
      <SongSelector />
      <Button className="mt-4">Generate Mashup</Button>
    </div>
  );
};

export default AutoGenerate;