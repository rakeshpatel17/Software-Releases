import React from 'react';
import './ToggleButtonComponent.css'; // Import the CSS

const ToggleButtonComponent = ({ options, value, onToggle }) => {
  if (!Array.isArray(options) || options.length === 0) {
    return null;
  }

  const currentIndex = options.indexOf(value);
  const nextIndex = (currentIndex + 1) % options.length;

  const handleToggle = () => {
    const nextValue = options[nextIndex];
    onToggle(nextValue);
  };

  // Determine style class based on value
  let styleClass = 'toggle-grey';
  if (['Yes', 'Released'].includes(value)) {
    styleClass = 'toggle-green';
  } else if (['No', 'Not Released'].includes(value)) {
    styleClass = 'toggle-red';
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={handleToggle}
        className={`toggle-button ${styleClass}`}
      >
        {value}
      </button>
    </div>
  );
};

export default ToggleButtonComponent;
