import React from 'react';
const Contact: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-200 p-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          {/* Optionally add a title or leave it blank for pure icons */}
          Connect with me:
        </div>
        <div className="flex space-x-6">
          {/* LinkedIn Icon */}
          <a 
            href="https://www.linkedin.com/in/**************" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-400 transition duration-300"
          >
            <FaLinkedin size={28} />
          </a>

          {/* Email Icon */}
          <a 
            href="mailto:***************" 
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
