
import React from 'react';
import PropTypes from 'prop-types';
import './DropdownItem.css';

function DropdownItem({ iconClass, name, hyperlink }) {
  return (
    <a href={hyperlink} className="dropdown-item">
      <i className={`dropdown-item-icon ${iconClass}`}></i>
      <span className="dropdown-item-name">{name}</span>
    </a>
  );
}

DropdownItem.propTypes = {
  iconClass: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hyperlink: PropTypes.string.isRequired,
};

export default DropdownItem;
