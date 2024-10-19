import React from 'react';

const Contact: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#1E293B', // Dark gray background
        color: '#F8FAFC', // Light text color
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '3rem',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#3B82F6', // Blue for title
        }}
      >
        Get in Touch
      </h2>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>LinkedIn:</strong>
        </p>
        <a
          href="https://www.linkedin.com/in/david-velasquez-az/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: '500',
          }}
        >
          /david-velasquez-az/
        </a>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Email:</strong>
        </p>
        <a
          href="mailto:davidxvaz@gmail.com"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: '500',
          }}
        >
          davidxvaz@gmail.com
        </a>
      </div>
      {/* <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Website:</strong>
        </p>
        <a
          href="https://www.your-website.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: '500',
          }}
        >
          www.your-website.com
        </a>
      </div> */}
      <div style={{ marginTop: '2rem' }}>
        <button
          style={{
            padding: '0.75rem 2rem',
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
        >
          Contact Me
        </button>
      </div>
    </div>
  );
};

export default Contact;
