import React, { useState, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface SoundToggleProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ soundEnabled, setSoundEnabled }) => {
  // Load sound preference from localStorage on mount
  useEffect(() => {
    const savedSoundPref = localStorage.getItem('soundEnabled');
    console.log('Sound preference in localStorage (on load):', savedSoundPref);
    if (savedSoundPref !== null) {
      setSoundEnabled(JSON.parse(savedSoundPref));
    } 
  }, [setSoundEnabled]);


  // Update localStorage when the soundEnabled state changes
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleToggle = () => {
    setSoundEnabled(!soundEnabled);
    console.log(`Sound ${!soundEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <label className="flex items-center space-x-2">
      {soundEnabled ? (
        <SpeakerWaveIcon className="h-6 w-6 text-blue-700" /> 
      ) : (
        <SpeakerXMarkIcon className="h-6 w-6 text-red-500" /> 
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
