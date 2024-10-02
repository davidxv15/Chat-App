import React, { useState, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface SoundToggleProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ soundEnabled, setSoundEnabled }) => {
   // Update localStorage when the soundEnabled state changes
   useEffect(() => {
    if (soundEnabled !== null) {  // Ensure soundEnabled is not null or undefined
      localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
      console.log('Sound preference saved:', soundEnabled);
    }
  }, [soundEnabled]); // Trigger the effect when soundEnabled changes



  // Update localStorage when the soundEnabled state changes
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleToggle = () => {
    setSoundEnabled(!soundEnabled);
    console.log(`Sound ${!soundEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <label className="flex items-center space-x-2 absolute top-14 right-14">
      {soundEnabled ? (
        <SpeakerWaveIcon className="h-6 w-6 text-blue-800" /> 
      ) : (
        <SpeakerXMarkIcon className="h-6 w-6 text-red-700" /> 
      )}
      <input
        type="checkbox"
        checked={soundEnabled}
        onChange={handleToggle}
        className="toggle-checkbox"
      />
    </label>
  );
};

export default SoundToggle;
