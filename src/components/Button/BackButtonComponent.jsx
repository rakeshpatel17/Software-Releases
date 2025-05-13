import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function BackButtonComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
      navigate(-1);
  };

  return (
    <button 
      onClick={handleBack}
      style={{
        padding: '8px 12px',
        borderRadius: '5px',
        backgroundColor: '#e2e8f0',
        border: '1px solid #cbd5e0',
        cursor: 'pointer',
        marginTop: '-20px',
      }}
      className="nav-btn"
    >
      ← 
    </button>
  );
}

export default BackButtonComponent;

