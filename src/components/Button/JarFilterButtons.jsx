// components/JarFilterButtons.jsx

import React from 'react';
import PropTypes from 'prop-types';

export default function JarFilterButtons({
  allJars,
  selectedStatuses,
  onToggleStatus,
  onToggleAll
}) {
  // statuses to show
  const statuses = ['updated', 'not updated'];

  // count how many jars in each status
  const statusCounts = allJars.reduce((acc, jar) => {
    const key = jar.updated ? 'updated' : 'not updated';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalCount = allJars.length;

  return (
    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* All button */}
      <button
        onClick={onToggleAll}
        style={{
          marginRight: 12,
          padding: '4px 8px',
          fontWeight: selectedStatuses.size === statuses.length ? 'bold' : 'normal',
          opacity: selectedStatuses.size === statuses.length ? 1 : 0.6,
          color: '#20338b'
        }}
      >
        All ({totalCount})
      </button>

      {/* Updated / Not Updated */}
      {statuses.map(status => (
        <button
          key={status}
          onClick={() => onToggleStatus(status)}
          style={{
            marginRight: 6,
            padding: '4px 8px',
            fontWeight: selectedStatuses.has(status) ? 'bold' : 'normal',
            opacity: selectedStatuses.has(status) ? 1 : 0.6,
            color: status === 'updated' ? '#008000' : '#FF0000'
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status] || 0})
        </button>
      ))}
    </div>
  );
}

JarFilterButtons.propTypes = {
  /** Full array of jars to count/filter */
  allJars:            PropTypes.array.isRequired,
  /** Set of currently-selected statuses ('updated','not updated') */
  selectedStatuses:   PropTypes.instanceOf(Set).isRequired,
  /** (status: string) => void */
  onToggleStatus:     PropTypes.func.isRequired,
  /** () => void */
  onToggleAll:        PropTypes.func.isRequired,
};
