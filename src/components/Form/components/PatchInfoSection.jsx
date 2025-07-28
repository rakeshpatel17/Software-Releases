import React from 'react';

export function PatchInfoSection({ formData, errors, handleChange }) {
    return (
        <>
            <div className="form-group">
                <label className="form-label">KBA</label>
                <input type="text" name="kba" value={formData.kba} onChange={handleChange} className="form-textarea" />
            </div>
            <div className="form-group">
                <label className="form-label">Functional Fixes</label>
                <input type="text" name="functional_fixes" value={formData.functional_fixes} onChange={handleChange} className="form-textarea" />
            </div>
            <div className="form-group">
                <label className="form-label">Security issues</label>
                <input type="text" name="security_issues" value={formData.security_issues} onChange={handleChange} className="form-textarea" />
            </div>
            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="form-textarea" />
                {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Patch state</label>
                <select name="patch_state" value={formData.patch_state} onChange={handleChange} className="form-select">
                    <option value="new">New</option>
                    <option value="released">Released</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="in_progress">In progress</option>
                </select>
            </div>
        </>
    );
}