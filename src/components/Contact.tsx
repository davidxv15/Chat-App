import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg mt-6 w-full max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Get in Touch</h2>
      <div className="mb-4">
        <p className="font-semibold mb-2">LinkedIn:</p>
        <a
          href="https://www.linkedin.com/in/****************/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-lg"
        >
          /****************/
        </a>
      </div>
      <div className="mb-4">
        <p className="font-semibold mb-2">Email:</p>
        <a
          href="mailto:**************"
          className="text-blue-400 hover:underline text-lg"
        >
          ****************
        </a>
      </div>
      {/* Uncomment and replace with your website if you want to include it */}
      {/* <div className="mb-4">
        <p className="font-semibold mb-2">Website:</p>
        <a
          href="https://www.your-website.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-lg"
        >
          www.your-website.com
        </a>
      </div> */}
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Contact Me
        </button>
      </div>
    </div>
  );
};

export default Contact;
