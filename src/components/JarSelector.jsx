import React, { useState } from 'react';
import './JarSelector.css';

function JarSelector({
    jarSearchTerm,
    setJarSearchTerm,
    filteredJars,
    expandedJar,
    setExpandedJar,
    selectedJars,
    setSelectedJars
}) {
    const [showRemarksInput, setShowRemarksInput] = useState(false);
    const [remarks, setRemarks] = useState('');

    return (
        <div className="form-group">
            <label className="form-label">Add Third-Party JAR</label>

            <div className="jar-search-wrapper">
                <div className="jar-search-bar">
                    <input
                        type="text"
                        placeholder="Search for JAR"
                        value={jarSearchTerm}
                        onChange={(e) => {
                            setJarSearchTerm(e.target.value);
                            setExpandedJar(null);
                            setShowRemarksInput(false);
                            setRemarks('');
                        }}
                        className="form-input search-jar-input"
                    />
                </div>

                {jarSearchTerm && filteredJars.length > 0 && !expandedJar && (
                    <div className="jar-dropdown">
                        {filteredJars.map((jar) => (
                            <div
                                key={jar.name}
                                className="jar-dropdown-item"
                                onClick={() => {
                                    setExpandedJar(jar.name);
                                    setJarSearchTerm('');
                                }}
                            >
                                {jar.name}
                            </div>
                        ))}
                    </div>
                )}

                {expandedJar && (
                    <>
                        <div className="jar-selected">
                            <div className="jar-details-row">
                                <input
                                    type="checkbox"
                                    checked={selectedJars.includes(expandedJar)}
                                    onChange={() =>
                                        setSelectedJars((prev) =>
                                            prev.includes(expandedJar)
                                                ? prev.filter((name) => name !== expandedJar)
                                                : [...prev, expandedJar]
                                        )
                                    }
                                    className="jar-checkbox"
                                />
                                <span className="jar-name">{expandedJar}</span>
                                <input
                                    type="text"
                                    placeholder="Version"
                                    className="form-input jar-version-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setExpandedJar(null);
                                        setShowRemarksInput(false);
                                        setRemarks('');
                                    }}
                                    className="jar-close-btn"
                                    title="Remove"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="jar-remarks-toggle"
                            onClick={() => setShowRemarksInput(!showRemarksInput)}
                        >
                            {showRemarksInput ? 'Hide Remarks' : 'Add Remarks'}
                        </button>
                        {showRemarksInput && (
                            <div className="jar-remarks-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="jar-remarks-input"
                                />
                            </div>
                        )}


                    </>
                )}
            </div>
        </div>
    );
}

export default JarSelector;
