//RoleVisibility.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

export default function RoleVisibility({ roles = [], children }) {
  const { user } = useAuth();
  const isAllowed = !roles.length || (user && roles.includes(user.role));

  return (
    <div
      style={{
        visibility: isAllowed ? 'visible' : 'hidden',
        pointerEvents: isAllowed ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );
}

RoleVisibility.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
};
