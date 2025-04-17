import React from 'react';
import PropTypes from 'prop-types';
import './Heading.css'; // custom CSS for styling

const Heading = ({ link, name }) => {
  return (
    <div className="heading-container">
      <img src={link} alt={name} className="heading-image" />
      <h1 className="heading-text">{name}</h1>
    </div>
  );
};

Heading.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Heading;
