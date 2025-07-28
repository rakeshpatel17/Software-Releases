import React from 'react';
import './CompareImage.css';
import { useOutletContext } from 'react-router-dom';
import { useImageComparison } from './hooks/useImageComparison';
import ComparisonControls from './components/ComparisonControls';
import ComparisonResultsTable from './components/ComparisonResultsTable';

export default function CompareImage() {
    const { setTitle } = useOutletContext();
    
    // All logic and state comes from the custom hook
    const {
        patch1,
        setPatch1,
        patch2,
        setPatch2,
        patches,
        comparedImages,
        showComparison,
        isLoading,      // <--  Destructure isLoading here
        handleCompare
    } = useImageComparison(setTitle);

    return (
        <div className="compare-container">
            <h2>Compare Patch Images</h2>

            <ComparisonControls
                patches={patches}
                patch1={patch1}
                setPatch1={setPatch1}
                patch2={patch2}
                setPatch2={setPatch2}
                isLoading={isLoading} // <-- CORRECTED: Pass isLoading as a prop
                onCompare={handleCompare}
            />
            
            {/* Optional but highly recommended: Show a loading indicator */}
            {isLoading && (
                <div style={{ textAlign: 'center', margin: '20px', fontSize: '18px', color: '#555' }}>
                    Loading Image Details...
                </div>
            )}

            {/* Hide results while loading to prevent showing stale data */}
            {showComparison && !isLoading && (
                <ComparisonResultsTable
                    comparedImages={comparedImages}
                    patch1={patch1}
                    patch2={patch2}
                />
            )}
        </div>
    );
}