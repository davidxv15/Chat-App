import React from 'react';

const Contact: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#1E293B', // Dark gray background
        color: '#F8FAFC', // Light text color
        padding: '1rem', // Reduced padding
        borderRadius: '0.5rem',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)', // Smaller shadow
        marginTop: '1rem', // Smaller top margin
        width: '100%',
        maxWidth: '500px', // Reduced max width for sleek look
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem', // Slightly smaller font for compact design
          fontWeight: 'bold',
          marginBottom: '0.75rem', // Reduced margin
          color: '#3B82F6', // Blue for title
        }}
      >
        Get in Touch
      </h2>

      <div style={{ marginBottom: '0.75rem' }}> {/* Reduced spacing */}
        <p style={{ marginBottom: '0.25rem' }}> {/* Smaller margin */}
          <strong>LinkedIn:</strong>
        </p>
        <a
          href="https://www.linkedin.com/in/david-velasquez-az/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontSize: '1.125rem', // Slightly smaller font size
            fontWeight: '500',
          }}
        >
          /david-velasquez-az/
        </a>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ marginBottom: '0.25rem' }}>
          <strong>Email:</strong>
        </p>
        <a
          href="mailto:davidxvaz@gmail.com"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontSize: '1.125rem',
            fontWeight: '500',
          }}
        >
          davidxvaz@gmail.com
        </a>
      </div>

      {/* You can uncomment the Website section when ready */}
      {/* 
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ marginBottom: '0.25rem' }}>
          <strong>Website:</strong>
        </p>
        <a
          href="https://www.your-website.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontSize: '1.125rem',
            fontWeight: '500',
          }}
        >
          www.your-website.com
        </a>
      </div>
      */}

      <div style={{ marginTop: '1.5rem' }}> {/* Reduced margin */}
        <button
          style={{
            padding: '0.5rem 1.5rem', // Smaller padding
            backgroundColor: '#3B82F6',
            color: '#F8FAFC',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#2563EB')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#3B82F6')
          }
          onClick={() => alert('This could link to a booking or contact form!')} 
        >
          Contact Me
        </button>
      </div>
    </div>
  );
};

export default Contact;
