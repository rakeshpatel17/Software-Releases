import React from 'react';

export function PatchTimeline({ patch, isEditing, onChange }) {
    return (
        <div className="form-row">
            <div className="form-group">
                <label>Kick Off</label>
                <input type="date" name="kick_off" value={patch.kick_off || ''} disabled={!isEditing} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Code Freeze Date</label>
                <input type="date" name="code_freeze" value={patch.code_freeze || ''} disabled={!isEditing} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Platform QA Build</label>
                <input type="date" name="platform_qa_build" value={patch.platform_qa_build || ''} disabled={!isEditing} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Client Build</label>
                <input type="date" name="client_build_availability" value={patch.client_build_availability || ''} disabled={!isEditing} onChange={onChange} />
            </div>
        </div>
    );
}