import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

type Props = {
  audioUrl: string;
};

const WaveformPlayer: React.FC<Props> = ({ audioUrl }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#7dd3fc',
        progressColor: '#0284c7',
        height: 100,
        responsive: true,
      });

      wavesurfer.current.on('ready', () => {
        setIsReady(true);
        console.log("✅ WaveSurfer is ready");
      });

      wavesurfer.current.load(audioUrl);
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (wavesurfer.current && isReady) {
      wavesurfer.current.playPause();
    } else {
      console.warn("⏳ Audio not ready yet.");
    }
  };

  return (
    <div className="space-y-2">
      <div ref={waveformRef} className="w-full bg-gray-700 rounded" />
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!isReady}
      >
        {isReady ? 'Play / Pause' : 'Loading...'}
      </button>
    </div>
  );
};

export default WaveformPlayer;
