import React, { useState, useEffect } from 'react';
import './JarSelector.css';

function JarSelector({
    mode = 'edit', // 'edit' or 'search'
    selectedJars,
    setSelectedJars,
    isEditing,
    jarSearchTerm,
    setJarSearchTerm,
    filteredJars,
    expandedJar,
    setExpandedJar
}) {
    const [tempSelectedJars, setTempSelectedJars] = useState([...selectedJars]);
    const [showRemarksInput, setShowRemarksInput] = useState(false);
    const [remarks, setRemarks] = useState('');

    // Reset for edit mode
    useEffect(() => {
        if (!isEditing && mode === 'edit') {
            setTempSelectedJars([...selectedJars]);
        }
    }, [isEditing, selectedJars, mode]);

    // Handlers (edit mode)
    const handleJarChange = (index, field, value) => {
        const updated = [...tempSelectedJars];
        updated[index][field] = value;
        setTempSelectedJars(updated);
    };

    const handleAddJar = () => {
        const updated = [...tempSelectedJars, { name: '', version: '', remarks: '' }];
        setTempSelectedJars(updated);
    };

    const handleRemoveJar = (index) => {
        const updated = tempSelectedJars.filter((_, i) => i !== index);
        setTempSelectedJars(updated);
    };

    // Render: Search Mode
    if (mode === 'search') {
        return (
            <div className="form-group">
                <label className="form-label">Add Third-Party JAR</label>

                <div className="jar-search-wrapper">
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

                    {jarSearchTerm && filteredJars?.length > 0 && !expandedJar && (
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

    // Render: Edit Mode (default)
    return (
        <div className="form-group">
            <label>Third Party JARs</label>
            <table className="read-only-jars-table">
                <thead>
                    <tr>
                        <th>Third Party Jar</th>
                        <th>Version</th>
                        <th>Remarks</th>
                        {isEditing && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {tempSelectedJars.map((jar, index) => (
                        <tr key={index}>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={jar.name}
                                        onChange={(e) => handleJarChange(index, 'name', e.target.value)}
                                        placeholder="Jar name"
                                    />
                                ) : (
                                    jar.name
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={jar.version}
                                        onChange={(e) => handleJarChange(index, 'version', e.target.value)}
                                        placeholder="Version"
                                    />
                                ) : (
                                    jar.version
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={jar.remarks}
                                        onChange={(e) => handleJarChange(index, 'remarks', e.target.value)}
                                        placeholder="Remarks"
                                    />
                                ) : (
                                    jar.remarks
                                )}
                            </td>
                            {isEditing && (
                                <td>
                                    <button type="button" onClick={() => handleRemoveJar(index)}>
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditing && (
                <button type="button" className="add-jar-btn" onClick={handleAddJar}>
                    + Add JAR
                </button>
            )}
        </div>
    );
}

export default JarSelector;
