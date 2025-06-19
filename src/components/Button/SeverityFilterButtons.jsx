import React from 'react';
import PropTypes from 'prop-types';

function SeverityFilterButtons({ allIssues, selectedLevels, onToggleLevel, onToggleAll }) {
  const levels = ['critical', 'high', 'medium', 'low'];
  const severityColors = {
    low: '#008000',
    medium: '#FFD700',
    high: '#FF8C00',
    critical: '#FF0000'
  };

  const severityCounts = allIssues.reduce((acc, issue) => {
    const sev = issue.severity.toLowerCase();
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});
  const totalCount = allIssues.length;

  return (
    <div className="severity-filter-buttons" style={{ marginBottom: 8 }}>
      <button
        onClick={onToggleAll}
        style={{
          marginRight: 12,
          padding: '4px 8px',
          fontWeight: selectedLevels.size === levels.length ? 'bold' : 'normal',
          opacity: selectedLevels.size === levels.length ? 1 : 0.6,
          color: '#20338b'
        }}
      >
        All ({totalCount})
      </button>
      {levels.map(level => (
        <button
          key={level}
          onClick={() => onToggleLevel(level)}
          style={{
            marginLeft: 6,
            padding: '4px 8px',
            fontWeight: selectedLevels.has(level) ? 'bold' : 'normal',
            opacity: selectedLevels.has(level) ? 1 : 0.6,
            color: severityColors[level]
          }}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)} ({severityCounts[level] || 0})
        </button>
      ))}
    </div>
  );
}

SeverityFilterButtons.propTypes = {
  allIssues: PropTypes.array.isRequired,
  selectedLevels: PropTypes.instanceOf(Set).isRequired,
  onToggleLevel: PropTypes.func.isRequired,
  onToggleAll: PropTypes.func.isRequired
};

export default SeverityFilterButtons;