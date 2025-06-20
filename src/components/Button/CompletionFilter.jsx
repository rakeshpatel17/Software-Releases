function CompletionFilter({ filter, setFilter, counts }) {
  const toggleFilter = (type) => {
    if (filter === type) {
      setFilter('all');
    } else {
      setFilter(type);
    }
  };

 const baseStyle = {
  padding: '8px 14px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#ccc',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  backgroundColor: '#f7f7f7',
  color: '#333',
  transition: 'all 0.2s ease',
};

  const activeStyle = {
    borderColor: '#000',
    backgroundColor: '#e0e0e0',
  };

  const getButtonStyle = (type) => {
    const isActive = filter === type;
    const colorStyle = {
      color: type === 'completed' ? 'green' : 'red',
    };
    return {
      ...baseStyle,
      ...(isActive ? activeStyle : {}),
      ...colorStyle,
    };
  };

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
      <button
        style={getButtonStyle('completed')}
        onClick={() => toggleFilter('completed')}
      >
        Completed ({counts.completed})
      </button>
      <button
        style={getButtonStyle('not_completed')}
        onClick={() => toggleFilter('not_completed')}
      >
        Not Completed ({counts.not_completed})
      </button>
    </div>
  );
}

export default CompletionFilter;
