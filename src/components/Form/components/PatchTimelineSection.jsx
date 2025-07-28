import React from 'react';

// This component is now corrected to allow user edits, just like the original code.
export function PatchTimelineSection({ formData, errors, handleChange }) {
    const today = new Date().toISOString().split("T")[0];
    
    return (
        <div className="inline-fields">
            <div className="form-group">
                <label className="form-label">Kick Off Date</label>
                <input
                    type="date"
                    name="kick_off"
                    value={formData.kick_off}
                    onChange={handleChange} // This is now active and works correctly
                    className="form-input"
                    min={today}
                    max={formData.release_date || ''}
                />
                {errors.kick_off && <span className="error-text">{errors.kick_off}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Code Freeze Date</label>
                <input
                    type="date"
                    name="code_freeze"
                    value={formData.code_freeze}
                    onChange={handleChange} // This is now active
                    className="form-input"
                    min={today}
                    max={formData.release_date || ''}
                />
                {errors.code_freeze && <span className="error-text">{errors.code_freeze}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Platform QA Build Date</label>
                <input
                    type="date"
                    name="platform_qa_build"
                    value={formData.platform_qa_build}
                    onChange={handleChange} // This is now active
                    className="form-input"
                    min={today}
                    max={formData.release_date || ''}
                />
                {errors.platform_qa_build && <span className="error-text">{errors.platform_qa_build}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Client Build Date</label>
                <input
                    type="date"
                    name="client_build_availability"
                    value={formData.client_build_availability}
                    onChange={handleChange} // This is now active
                    className="form-input"
                    min={today}
                    max={formData.release_date || ''}
                />
                {errors.client_build_availability && <span className="error-text">{errors.client_build_availability}</span>}
            </div>
        </div>
    );
}