import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  username: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping, username }) => {
  if (!isTyping) return null;

  return (
    <div className="typing-indicator">
      {username} is typing...
    </div>
  );
};

export default TypingIndicator;
