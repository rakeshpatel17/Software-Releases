import React, { useState } from 'react';

const ToggleButtonComponent = ({ value = false, onToggle }) => {
  const [toggled, setToggled] = useState(value);

  const handleToggle = () => {
    const newValue = !toggled;
    setToggled(newValue);
    onToggle(newValue);
  };

  return (
    <div style={{textAlign:'center'}}>
    <button
      onClick={handleToggle}
      style={{
        padding: '6px 12px',
        borderRadius: '5px',
        backgroundColor: toggled ? '#d4edda' : '#f8d7da',
        color: toggled ? '#155724' : '#721c24',
        border: '1px solid',
        borderColor: toggled ? '#c3e6cb' : '#f5c6cb',
        cursor: 'pointer',
      }}
    >
      {toggled ? 'Yes' : 'No'}
    </button>
    </div>
  );
};

export default ToggleButtonComponent;
