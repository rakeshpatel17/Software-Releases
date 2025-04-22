import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MenuItem.css';
import DropdownItem from './DropdownItem';

function MenuItem({ iconClass, name, hyperlink, data }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (data) setIsOpen(prev => !prev);
  };

  return (
    <div className="menu-item-container">
      <div className="menu-item" onClick={handleToggle}>
        {/* Dropdown arrow for expandable items (now on the left) */}
        {data && (
          <i
            className={`dropdown-arrow-left bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'
              }`}
          ></i>
        )}

        {/* Bootstrap icon */}
        <i className={`menu-item-icon ${iconClass}`}></i>

        <span className="menu-item-name">{name}</span>
      </div>


      {data && isOpen && (
        <div className="dropdown-container">
          {data.map((item, index) => (
            <DropdownItem key={index} {...item} />
          ))}
        </div>
      )}

      {!data && hyperlink && (
        <a href={hyperlink} className="menu-item-link-overlay" />
      )}
    </div>
  );
}

MenuItem.propTypes = {
  iconClass: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hyperlink: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      iconClass: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hyperlink: PropTypes.string.isRequired
    })
  )
};

export default MenuItem;
