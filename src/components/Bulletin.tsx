import React from "react";

const Bulletin: React.FC = () => {
  return (
    <div className="bulletin rounded bg-gray-700 text-center px-14 py-4 mb-4 mt-4 border-b border-gray-300 dark:border-gray-800">
      <h2 className="text-xl font-bold text-blue-600">Your Ad Here!</h2>
      <p className="text-gray-500 dark:text-gray-400 p-2">
        Visit our sponsors! Advertise here!
      </p>
      <p className="contact">Contact </p>
    </div>
  );
};

export default Bulletin;
