// EditableFieldComponent.jsx
import React, { useState } from 'react';

const EditableFieldComponent = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <>
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            rows={3}
            style={{ width: '100%' ,borderRadius:'5px'}}
          />
          <button style={{ marginTop: '4px',borderRadius:'5px',backgroundColor:'#f7f9fc' }} onClick={handleSave}>
            Save
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '4px'}}>{value}</div>
          <button style={{ marginTop: '4px',borderRadius:'5px',backgroundColor:'#f7f9fc' }}
            onClick={() => {
              setIsEditing(true);
              setEditedValue(value);
            }}
          >
            Edit
          </button>
        </>
      )}
    </>
  );
};

export default EditableFieldComponent;
