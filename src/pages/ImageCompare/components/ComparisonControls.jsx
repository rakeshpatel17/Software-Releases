import React from 'react';
import CustomDropdown from './CustomDropdown';

export default function ComparisonControls({ patches, patch1, setPatch1, patch2, setPatch2, onCompare, isLoading }) {
    const patchNames = patches.map(p => p.name);

    return (
        <>
            <div className="dropdown-row">
                <CustomDropdown
                    label="Patch 1"
                    options={patchNames}
                    value={patch1}
                    onChange={(e) => setPatch1(e.target.value)}
                    placeholder="Select Patch"
                />
                <CustomDropdown
                    label="Patch 2"
                    options={patchNames}
                    value={patch2}
                    onChange={(e) => setPatch2(e.target.value)}
                    placeholder="Select Patch"
                />
            </div>

            {patch1 && patch2 && (
                <button
                    className="compare-btn"
                    onClick={onCompare}
                    disabled={isLoading} // Disable the button when isLoading is true
                >
                    {/*  Change button text while loading */}
                    {isLoading ? 'Comparing...' : 'Compare'}
                </button>
            )}
        </>
    );
}