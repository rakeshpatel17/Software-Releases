import React from 'react';

export function PatchDetails({ patch, isEditing, onChange }) {
    return (
        <div className="form-row">
            <div className="form-group">
                <label>Release</label>
                <input type="text" name="release" value={patch.release || ''} disabled={!isEditing} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Version</label>
                <input type="text" name="name" value={patch.name || ''} disabled={!isEditing} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Release Date</label>
                <input type="date" name="release_date" value={patch.release_date || ''} disabled={!isEditing} onChange={onChange} min={new Date().toISOString().split("T")[0]} />
            </div>
        </div>
    );
}