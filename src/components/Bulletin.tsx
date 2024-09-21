import React from 'react';

const Bulletin: React.FC = () => {
    return (
      <div className="ad-banner bg-gray-100 dark:bg-gray-800 text-center py-4 mb-4 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-bold text-blue-600">Your Ad Here!</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Visit our sponsors or advertise with us!
        </p>
      </div>
    );
  };

  export default Bulletin;