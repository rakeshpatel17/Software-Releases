import './HighLevelScope.css';
import { Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';


const staticLabelData = [
    { label: 'Base OS' },
    { label: 'Base OS1' },
    { label: 'Base OS2' },
    { label: 'Base OS3' },
    { label: 'Base OS4' },
    { label: 'Base OS5' },
    { label: 'Tomcat' },
    { label: 'JDK' },
    { label: 'OTDS' },
    { label: 'New Relic' },
];

function HighLevelScope({ highLevelScope, isEditing }) {
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



    const handleAddScope = () => {
        const updatedScope = [...tempHighLevelScope, { label: '', value: '' }];
        setTempHighLevelScope(updatedScope);
    };

    const handleRemoveScope = (index, e) => {
        e.preventDefault(); // Prevent form submission
        const updatedScope = tempHighLevelScope.filter((_, i) => i !== index);
        setTempHighLevelScope(updatedScope);
    };
    //search 
    const labelRefs = useRef([]);
    const [labelSuggestions, setLabelSuggestions] = useState([]); // array of arrays for each row
    const handleLabelChange = (index, newLabel) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].label = newLabel;
        setTempHighLevelScope(updatedScope);

        const filteredSuggestions = newLabel.trim()
            ? staticLabelData.filter(s =>
                s.label.toLowerCase().includes(newLabel.toLowerCase())
            )
            : [];
        const updatedSuggestions = [...labelSuggestions];
        updatedSuggestions[index] = filteredSuggestions;
        setLabelSuggestions(updatedSuggestions);
    };

    const handleSuggestionClick = (index, suggestion) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].label = suggestion.label;
        setTempHighLevelScope(updatedScope);

        const updatedSuggestions = [...labelSuggestions];
        updatedSuggestions[index] = [];
        setLabelSuggestions(updatedSuggestions);
    };
    useEffect(() => {
  const handleClickOutside = (event) => {
    const updatedSuggestions = labelSuggestions.map((sugList, i) => {
      const refEl = labelRefs.current[i];
      if (refEl && !refEl.contains(event.target)) {
        return [];
      }
      return sugList;
    });
    setLabelSuggestions(updatedSuggestions);
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [labelSuggestions]);


    return (
        <div className="high-level-scope">
            <label>High Level Scope</label>
            {isEditing ? (
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
                            {tempHighLevelScope.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{ position: 'relative' }} ref={(el) => (labelRefs.current[index] = el)}
                                        >
                                            <input
                                                type="text"
                                                value={item.label}
                                                onChange={(e) => handleLabelChange(index, e.target.value)}
                                                autoComplete="off"
                                            />
                                            {labelSuggestions[index] && labelSuggestions[index].length > 0 && (
                                                <div className="scope-dropdown">
                                                    {labelSuggestions[index].map((s, i) => (
                                                        <div
                                                            key={i}
                                                            className="scope-dropdown-item"
                                                            onClick={() => handleSuggestionClick(index, s)}
                                                        >
                                                            {s.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

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
                                <th>Name</th>
                                <th>Version</th>
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
