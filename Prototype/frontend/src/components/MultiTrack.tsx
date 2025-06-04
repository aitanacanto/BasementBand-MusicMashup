import React, { useEffect, useRef } from 'react';
import { Song } from '@/components/types/song';

interface MultiTrackProps {
  songs: Song[];
  onReset: () => void;
}

const MultiTrack: React.FC<MultiTrackProps> = ({ songs, onReset }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const multiTrackRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || songs.length === 0) return;

    container.innerHTML = '';
    if (multiTrackRef.current?.destroy) {
      multiTrackRef.current.destroy();
      multiTrackRef.current = null;
    }

    import('wavesurfer-multitrack').then(({ default: Multitrack }) => {
      const tracks = songs.map((song, index) => ({
        id: index,
        url: typeof song.filepath === 'string'
          ? `http://localhost:50000/GetFile/${encodeURIComponent(song.filepath)}`
          : '',
        draggable: true,
        startPosition: 0,
        fadeInEnd: 5,
        fadeOutStart: 25,
        envelope: true,
        volume: 0.9,
        options: {
          waveColor: 'hsl(200, 80%, 50%)',
          progressColor: 'hsl(200, 80%, 30%)',
        },
      }));

      const mt = Multitrack.create(tracks, {
        container,
        minPxPerSec: 10,
        cursorWidth: 2,
        cursorColor: '#D72F21',
        trackBackground: '#1a1a1a',
        trackBorderColor: '#444',
        envelopeOptions: {
          lineColor: 'rgba(0, 255, 255, 0.6)',
          lineWidth: 3,
          dragPointSize: 30,
          dragPointFill: '#fff',
          dragPointStroke: '#aaa',
        },
      });

      multiTrackRef.current = mt;

      mt.on('start-position-change', ({ id, startPosition }) => {
        console.log(`Track ${id} start position updated to ${startPosition}`);
      });

      // ... más eventos omitidos por brevedad ...
    });

    return () => {
      if (multiTrackRef.current?.destroy) {
        multiTrackRef.current.destroy();
        multiTrackRef.current = null;
      }
    };
  }, [songs]);

  const handlePlayPause = () => {
    const mt = multiTrackRef.current;
    if (mt) mt.isPlaying() ? mt.pause() : mt.play();
  };

  const handleSeek = (seconds: number) => {
    const mt = multiTrackRef.current;
    if (mt) mt.setTime(mt.getCurrentTime() + seconds);
  };

  const handleZoom = (zoom: number) => {
    const mt = multiTrackRef.current;
    if (mt) mt.zoom(zoom);
  };

  const handleRestart = () => {
    if (multiTrackRef.current?.destroy) {
      multiTrackRef.current.destroy();
      multiTrackRef.current = null;
    }
    onReset(); // notifica al padre que borre las canciones
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">🎚 MultiTrack Mixer</h3>
      <div id="container" ref={containerRef} />
      <div className="mt-4 flex flex-wrap gap-4">
        <button
          onClick={handlePlayPause}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ▶️ Play / ⏸ Pause
        </button>
        <button
          onClick={() => handleSeek(-10)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ⏪ Rewind 10s
        </button>
        <button
          onClick={() => handleSeek(10)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ⏩ Forward 10s
        </button>
        <label className="flex items-center gap-2 text-sm">
          🔍 Zoom:
          <input
            type="range"
            min="10"
            max="100"
            defaultValue="10"
            onChange={(e) => handleZoom(parseInt(e.target.value))}
            className="w-32"
          />
        </label>
        <button
          onClick={handleRestart}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🔄 Restart
        </button>
      </div>
    </div>
  );
};

export default MultiTrack;
