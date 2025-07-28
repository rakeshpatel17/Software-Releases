import React from 'react';

export function PatchDetailsSection({ formData, errors, releaseList, lockedRelease, handleChange }) {
    return (
        <div className="inline-fields">
            <div className="form-group">
                <label className="form-label">Release</label>
                <select name="release" value={formData.release} onChange={handleChange} className="form-select" disabled={!!lockedRelease}>
                    <option value="" disabled>-- Select a Release --</option>
                    {releaseList.map((release) => (
                        <option key={release.name} value={release.name}>{release.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Version</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} className="form-input" />
                {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Release date</label>
                <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} className="form-input" min={new Date().toISOString().split("T")[0]} />
                {errors.release_date && <span className="error-text">{errors.release_date}</span>}
            </div>
        </div>
    );
}