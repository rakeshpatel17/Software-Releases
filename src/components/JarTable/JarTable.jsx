import React from 'react';
import PropTypes from 'prop-types';
import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent from '../ToggleButton/ToggleButton';
import { update_patch_product_jar } from '../../api/update_patch_product_jar';

function JarTable({
  id,
  productKey,
  jars,
  onJarsUpdate
}) {
  const handleSaveRemarks = async (jIdx, newValue) => {
    try {
      const jarName = jars[jIdx].name;
      await update_patch_product_jar(id, productKey, jarName, { remarks: newValue });
      const updated = jars.map((jar, i) =>
        i === jIdx ? { ...jar, remarks: newValue } : jar
      );
      onJarsUpdate(updated);
    } catch (error) {
      console.error('Error updating remarks:', error.message);
      alert('Failed to update remarks.');
    }
  };

  const handleToggleUpdated = (jIdx, newValue) => {
    const booleanValue = newValue === 'Yes';
    const updated = jars.map((jar, i) =>
      i === jIdx ? { ...jar, updated: booleanValue } : jar
    );
    onJarsUpdate(updated);
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Jar</th>
          <th>Current Version</th>
          <th>Version</th>
          <th>Remarks</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {jars.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center' }}>
              No jars available
            </td>
          </tr>
        ) : (
          jars.map((entry, jIdx) => (
            <tr key={jIdx}>
              <td>{entry.name}</td>
              <td>{entry.current_version}</td>
              <td>{entry.version}</td>
              <td>
                <EditableFieldComponent
                  value={entry.remarks || '—'}
                  onSave={(newValue) => handleSaveRemarks(jIdx, newValue)}
                />
              </td>
              <td>
                <ToggleButtonComponent
                  options={['Yes', 'No']}
                  value={entry.updated ? 'Yes' : 'No'}
                  onToggle={(newValue) => handleToggleUpdated(jIdx, newValue)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

JarTable.propTypes = {
  id: PropTypes.string.isRequired,
  productKey: PropTypes.string.isRequired,
  jars: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      version: PropTypes.string,
      current_version: PropTypes.string,
      remarks: PropTypes.string,
      updated: PropTypes.bool
    })
  ).isRequired,
  onJarsUpdate: PropTypes.func.isRequired
};

export default JarTable;
