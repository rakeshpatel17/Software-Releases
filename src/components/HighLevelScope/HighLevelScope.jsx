import  { useState, useEffect } from 'react';
import './HighLevelScope.css';
import { Trash2 } from 'lucide-react';


function HighLevelScope({ highLevelScope, isEditing, onScopeChange }) {
    const [tempHighLevelScope, setTempHighLevelScope] = useState([...highLevelScope]);

    // To reset the temp state when exiting edit mode
    useEffect(() => {
        if (!isEditing) {
            setTempHighLevelScope([...highLevelScope]); // Revert to the original state when exiting edit mode
        }
    }, [isEditing, highLevelScope]);

    const handleInputChange = (index, newValue) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].value = newValue;
        setTempHighLevelScope(updatedScope);
    };

    const handleLabelChange = (index, newLabel) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].label = newLabel;
        setTempHighLevelScope(updatedScope);
    };


    const handleAddScope = () => {
        const updatedScope = [...tempHighLevelScope, { label: '', value: '' }];
        setTempHighLevelScope(updatedScope);
    };

    const handleRemoveScope = (index, e) => {
        e.preventDefault(); // Prevent form submission
        const updatedScope = tempHighLevelScope.filter((_, i) => i !== index);
        setTempHighLevelScope(updatedScope);
    };

    return (
        <div className="high-level-scope">
            <label>High Level Scope</label>
            {isEditing ? (
                <>
                    <table className="editable-scope-table">
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tempHighLevelScope.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => handleLabelChange(index, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="scope-action-btn"
                                            onClick={(e) => handleRemoveScope(index, e)}
                                        >
                                            <Trash2 size={18} />

                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <button type="button" className="add-scope-btn" onClick={handleAddScope}>
                        + Add Scope
                    </button>
                </>
            ) : (
                <div className="read-only-scope">
                    <table className="read-only-scope-table">
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {highLevelScope.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.label}</td>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HighLevelScope;
