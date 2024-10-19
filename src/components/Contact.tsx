import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="contact bg-gray-800 text-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-2">Contact Information</h2>
      <p className="mb-2">
        <strong>LinkedIn:</strong> 
        <a href="https://www.linkedin.com/in/david-velasquez-az/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          LinkedIn
        </a>
      </p>
      <p className="mb-2">
        <strong>Email:</strong> 
        <a href="mailto:davidxvaz@gmail.com" className="text-blue-400 hover:underline">
        davidxvaz@gmail.com
        </a>
      </p>
      {/* <p className="mb-2">
        <strong>Website:</strong> 
        <a href="https://www.your-website.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          www.your-website.com
        </a>
      </p> */}
    </div>
  );
};

export default Contact;
