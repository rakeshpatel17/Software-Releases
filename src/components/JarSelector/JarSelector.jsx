import React from 'react';
import { useJarSelector } from './hooks/useJarSelector';
import { EditableJarView } from './components/EditableJarView';
import './JarSelector.css';

function JarSelector({ selectedJars = [], setSelectedJars, isEditing }) {
    // All complex logic is now managed by our custom hook.
    const {
        focusedIndex,
        setFocusedIndex,
        dropdowns,
        setDropdowns,
        handlers,
    } = useJarSelector(selectedJars, setSelectedJars);

    return (
        <div className="form-group jar-selector-edit">
            {isEditing ? (
                // When editing, render the full-featured EditableJarView component.
                <EditableJarView
                    selectedJars={selectedJars}
                    dropdowns={dropdowns}
                    setDropdowns={setDropdowns}
                    focusedIndex={focusedIndex}
                    setFocusedIndex={setFocusedIndex}
                    handlers={handlers}
                />
            ) : (
                // When not editing, render the simple read-only table.
                <div>
                    <label className='label'>Third Party JARs</label>
                    <table className="read-only-jars-table" style={{ marginTop: "10px" }}>
                        <thead>
                            <tr>
                                <th>Jar Name</th>
                                <th>Version</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(selectedJars || []).map((jar, index) => (
                                <tr key={index}>
                                    <td>{jar.name}</td>
                                    <td>{jar.version}</td>
                                    <td>{jar.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default JarSelector;