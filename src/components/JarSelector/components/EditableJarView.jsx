import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Renders the entire editable UI for the JarSelector, including the table, rows, and add button.
 */
export const EditableJarView = ({ selectedJars, dropdowns, setDropdowns, focusedIndex, setFocusedIndex, handlers }) => {
    // We use a ref to keep track of the DOM element for each row.
    const rowRefs = useRef([]);

    // This effect handles closing the suggestion dropdowns when the user clicks outside of them.
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickOutside = rowRefs.current.every(ref => ref && !ref.contains(event.target));
            if (isClickOutside) {
                setDropdowns([]); // Close all suggestion dropdowns.
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setDropdowns]);

    return (
        <>
            <label className='label'>Third Party JARs</label>
            <table className="jar-selector-edit-table">
                <thead>
                    <tr>
                        <th>Jar Name</th>
                        <th>Version</th>
                        <th>Remarks</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedJars.map((jar, index) => (
                        <tr key={index}>
                            <td style={{ position: 'relative' }} ref={(el) => (rowRefs.current[index] = el)}>
                                <input
                                    type="text"
                                    value={jar.name}
                                    onChange={(e) => handlers.handleJarChange(index, 'name', e.target.value)}
                                    onFocus={() => setFocusedIndex(index)}
                                    placeholder="Jar name"
                                    className="jar-selector-edit-input"
                                />
                                {focusedIndex === index && dropdowns[index]?.length > 0 && (
                                    <div className="jar-dropdown">
                                        {dropdowns[index].map((suggestion, i) => (
                                            <div
                                                key={i}
                                                className="jar-dropdown-item"
                                                // onMouseDown prevents the input's onBlur from firing before the click is registered.
                                                onMouseDown={() => handlers.handleSelectSuggestion(index, suggestion.name)}
                                            >
                                                {suggestion.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={jar.version}
                                    onChange={(e) => handlers.handleJarChange(index, 'version', e.target.value)}
                                    placeholder="Version"
                                    className="jar-selector-edit-input"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={jar.remarks}
                                    onChange={(e) => handlers.handleJarChange(index, 'remarks', e.target.value)}
                                    placeholder="Remarks"
                                    className="jar-selector-edit-input"
                                />
                            </td>
                            <td className="lastchild">
                                <button
                                    type="button"
                                    onClick={() => handlers.handleRemoveJar(index)}
                                    className="jar-selector-edit-remove-btn"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                type="button"
                className="add-jar-btn jar-selector-edit-add-btn"
                onClick={handlers.handleAddJar}
            >
                + Add JAR
            </button>
        </>
    );
};