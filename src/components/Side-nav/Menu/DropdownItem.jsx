
import React from 'react';
import PropTypes from 'prop-types';
import './DropdownItem.css'

function DropdownItem({ icon, name, hyperlink }) {
  return (
    <>
        <a href={hyperlink} className="dropdown-item">
        <img src={icon} alt={`${name} icon`} className="dropdown-item-icon" />
        <span className="dropdown-item-name">{name}</span>
        </a>
    </>
  );
}

DropdownItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hyperlink: PropTypes.string.isRequired,
};

export default DropdownItem;
