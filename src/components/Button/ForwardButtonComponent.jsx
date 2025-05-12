import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForwardButtonComponent = () => {
  const navigate = useNavigate();

  const handleForward = () => {
    navigate(1); 
  };

  return (
    <button
      type="button"
      onClick={handleForward}
      style={{
        padding: '6px 12px',
        borderRadius: '5px',
        backgroundColor: '#e2e8f0',
        border: '1px solid #cbd5e0',
        cursor: 'pointer',
        marginLeft: '3px', 
        marginTop:'-20px'
      }}
    >
      →
    </button>
  );
};

export default ForwardButtonComponent;
