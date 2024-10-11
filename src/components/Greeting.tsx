import React from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming your AuthContext is in this path

const Greeting: React.FC = () => {
  const { user } = useAuth(); // Getting the username from your AuthContext

  const greetingStyle = {
    position: 'absolute' as 'absolute',
    top: '.5rem',
    right: '120px',
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  };

  return (
    <div style={greetingStyle}>
      {user?.username ? `Hello, ${user.username}!` : 'Hello!'}
    </div>
  );
};

export default Greeting;
