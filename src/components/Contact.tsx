import React from 'react';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-transparent text-gray-200 p-1 shadow-lg opacity-80">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          {/* Optionally add a title or leave it blank for pure icons */}
          Connect:
        </div>
        <div className="flex space-x-6">
          {/* LinkedIn Icon */}
          <a 
            href="https://www.linkedin.com/in/david-velasquez-az/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-500 transition duration-300"
          >
            <FaLinkedin size={28} />
          </a>

          {/* Email Icon */}
          <a 
            href="mailto:davidxvaz@gmail.com" 
            aria-label="Email"
            className="hover:text-red-400 transition duration-300"
          >
            <FaEnvelope size={28} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
