import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButtonComponent = ({ fallback = '/' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track previous URL
  const prevLocation = useRef(location.pathname);
  
  useEffect(() => {
    prevLocation.current = location.pathname;
  }, [location]);
  
  const handleBack = () => {
    if (location.pathname === prevLocation.current) {
      console.log('URL did not change, navigating to reload page');
      navigate(0); 
    } else {
    //   console.log('URL changed, navigating back...');
      navigate(-1); 
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      style={{
        padding: '6px 12px',
        borderRadius: '5px',
        backgroundColor: '#e2e8f0',
        border: '1px solid #cbd5e0',
        cursor: 'pointer',
        marginTop:'-20px'

      }}
    >
      ← 
    </button>
  );
};

export default BackButtonComponent;
