import React from 'react';

const Bulletin: React.FC = () => {
    return (
      <div className="bulletin rounded bg-gray-100 dark:bg-gray-800 text-center px-8 py-4 mb-4 mt-12 border-b border-gray-300 dark:border-gray-800">
        <h2 className="text-xl font-bold text-blue-600">Your Ad Here!</h2>
        <p className="text-gray-500 dark:text-gray-400 p-2">
          Visit our sponsors! Advertise with us!
        </p>
        <p className="contact">Contact - </p>
      </div>
    );
  };

  export default Bulletin;