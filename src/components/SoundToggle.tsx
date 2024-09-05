import React, { useState } from 'react';

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
      <span>Sound</span>
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
