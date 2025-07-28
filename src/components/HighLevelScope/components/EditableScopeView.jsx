import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Renders the entire editable UI for High Level Scopes, including the table and add button.
 */
export const EditableScopeView = ({ scopes, labelSuggestions, setLabelSuggestions, handlers }) => {
    const rowRefs = useRef([]);

    // This effect handles closing the suggestion dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickOutside = rowRefs.current.every(ref => ref && !ref.contains(event.target));
            if (isClickOutside) {
                setLabelSuggestions([]); // Close all suggestions
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setLabelSuggestions]);

    return (
        <>
            <table className="editable-scope-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {scopes.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <div
                                    style={{ position: 'relative' }}
                                    ref={(el) => (rowRefs.current[index] = el)}
                                >
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handlers.handleLabelChange(index, e.target.value)}
                                        autoComplete="off"
                                    />
                                    {labelSuggestions[index]?.length > 0 && (
                                        <div className="scope-dropdown">
                                            {labelSuggestions[index].map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="scope-dropdown-item"
                                                    onMouseDown={() => handlers.handleSuggestionClick(index, s)}
                                                >
                                                    {s.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={item.version}
                                    onChange={(e) => handlers.handleVersionChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="scope-action-btn"
                                    onClick={() => handlers.handleRemoveScope(index)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" className="add-scope-btn" onClick={handlers.handleAddScope}>
                + Add Scope
            </button>
        </>
    );
};