import React from 'react';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div className="connect fixed bottom-0 left-0 w-full bg-transparent text-gray-200 p-2 shadow-lg opacity-80">
      <div className="max-w-screen-xl mx-2 flex justify-between items-center">
        <div className="text-lg">
          {/* Connect: */}
        </div>
        <div className="flex space-x-2 pl-2 mb-3">
          {/* LinkedIn Icon */}
          <a 
            href="https://www.linkedin.com/in/david-velasquez-az/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-500 transition duration-300"
          >
            <FaLinkedin size={26} />
          </a>

          {/* Email Icon */}
          <a 
            href="mailto:davidxvaz@gmail.com" 
            aria-label="Email"
            className="hover:text-green-600 transition duration-300"
          >
            <FaEnvelope size={26} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
