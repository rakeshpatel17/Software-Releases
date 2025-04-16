
import React from 'react';
import PropTypes from 'prop-types';
import './SubHeading.css';

function SubHeading({ name }) {
  return (
    <>
    <h3 className="subheading">{name}</h3>
    </>
  );
}

SubHeading.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SubHeading;
