import React from 'react';

const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
};

export function PatchInfoSection({ patch, isEditing, onChange, onStateChange }) {
    const isReleased = patch.patch_state === 'released';

    return (
        <>
            <label>KBA</label>
            <textarea className="single-line-textarea" name="kba" value={patch.kba || ''} disabled={!isEditing || isReleased} onChange={onChange} onInput={handleTextareaInput} />
            
            <label>Functional Fixes</label>
            <textarea className="single-line-textarea" name="functional_fixes" value={patch.functional_fixes || ''} disabled={!isEditing || isReleased} onChange={onChange} onInput={handleTextareaInput} />
            
            <label>Security Issues</label>
            <textarea className="single-line-textarea" name="security_issues" value={patch.security_issues || ''} disabled={!isEditing || isReleased} onChange={onChange} onInput={handleTextareaInput} />
            
            <div className="form-group">
                <label>Patch State</label>
                <select name="patch_state" value={patch.patch_state || 'New'} disabled={!isEditing || isReleased} onChange={onStateChange}>
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="released">Released</option>
                </select>
            </div>
            
            <label>Description</label>
            <textarea name="description" value={patch.description || ''} disabled={!isEditing || isReleased} onChange={onChange} />
        </>
    );
}