
import React from 'react';
import PropTypes from 'prop-types';
import './MenuItem.css'

function MenuItem({ icon, name, hyperlink }) {
  return (
    <>
        <a href={hyperlink} className="menu-item">
        <img src={icon} alt={`${name} icon`} className="menu-item-icon" />
        <span className="menu-item-name">{name}</span>
        </a>
    </>
  );
}

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hyperlink: PropTypes.string.isRequired,
};

export default MenuItem;
