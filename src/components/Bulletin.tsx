import React from "react";

const Bulletin: React.FC = () => {
  return (
    <div
      className="bulletin rounded bg-gray-800 text-center px-14 py-4 mb-4 mt-4 border border-gray-300 dark:border-gray-800"
      role="complementary"
      aria-labelledby="bulletin-title"
      aria-describedby="bulletin-description"
    >
      <h2 className="text-2xl font-bold text-blue-600" id="bulletin-title">
        Your Ad Here!
      </h2>
      <p id="bulletin-description" className="text-gray-400 p-2">
        Visit our sponsors! Advertise here!
      </p>
      <p
        className="contact text-white"
        aria-label="Contact for advertisement inquiries"
      >
        Contact{" "}
      </p>
    </div>
  );
};

export default Bulletin;
