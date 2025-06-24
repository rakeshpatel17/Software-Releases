import React, { useState } from 'react';

export default function RefreshButton({ onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onRefresh(); // Wait for refresh to complete
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="btn p-0 bg-transparent border-0"
        title="Refresh"
        style={{
          position: 'absolute',
          right: '3px',
          marginRight: '3px',
        }}
        disabled={isLoading}
      >
        <i
          className="bi bi-arrow-clockwise fs-5"
          style={{
            display: 'inline-block',
            animation: isLoading ? 'spin 1s linear infinite' : 'none',
          }}
        ></i>
      </button>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
