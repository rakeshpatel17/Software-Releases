import React from 'react';
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
                                onClick={() => setExpandedJar(null)}
                                className="jar-close-btn"
                                title="Remove"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default JarSelector;
 