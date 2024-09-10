import React, { useState } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface SoundToggleProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ soundEnabled, setSoundEnabled }) => {
  const handleToggle = () => {
    setSoundEnabled(!soundEnabled);
    console.log(`Sound ${!soundEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <label className="sound-toggle">
      <span className="text-black dark:text-gray-300">Sound</span>
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
