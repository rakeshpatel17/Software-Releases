import React from 'react';
import { useNavigate } from 'react-router-dom';

function ForwardButtonComponent() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(1)} style={{
            padding: '8px 12px',
            borderRadius: '5px',
            backgroundColor: '#e2e8f0',
            border: '1px solid #cbd5e0',
            cursor: 'pointer',
            marginTop: '-20px',
            marginLeft:'6px'

        }}
            className="nav-btn">
            →
        </button>
    );
}

export default ForwardButtonComponent;
