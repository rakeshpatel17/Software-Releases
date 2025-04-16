import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MenuItem.css';
import DropdownItem from './DropdownItem';

function MenuItem({ icon, name, hyperlink, data }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (data) setIsOpen(prev => !prev);
  };

  return (
    <div className="menu-item-container">
      {/* Clickable part (link or dropdown trigger) */}
      <div className="menu-item" onClick={handleToggle}>
        <img src={icon} alt={`${name} icon`} className="menu-item-icon" />
        <span className="menu-item-name">{name}</span>
      </div>

      {/* Render dropdown if data exists */}
      {data && isOpen && (
        <div className="dropdown-container">
          {data.map((item, index) => (
            <DropdownItem key={index} {...item} />
          ))}
        </div>
      )}

      {/* If it's a simple link and not dropdown, show it as <a> */}
      {!data && hyperlink && (
        <a href={hyperlink} className="menu-item-link-overlay" />
      )}
    </div>
  );
}

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hyperlink: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hyperlink: PropTypes.string.isRequired
    })
  )
};

export default MenuItem;
