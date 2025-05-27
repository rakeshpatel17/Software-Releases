import './HighLevelScope.css';
import { Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import get_scopes from '../../api/get_scopes';

// const scopeDataSuggestions = [
//     { label: 'Base OS' },
//     { label: 'Base OS1' },
//     { label: 'Base OS2' },
//     { label: 'Base OS3' },
//     { label: 'Base OS4' },
//     { label: 'Base OS5' },
//     { label: 'Tomcat' },
//     { label: 'JDK' },
//     { label: 'OTDS' },
//     { label: 'New Relic' },
// ];

function HighLevelScope({ highLevelScope = [], setHighLevelScope = () => {}, isEditing }) {
    // console.log("highLeveScope we get : , ", highLevelScope);
    const [tempHighLevelScope, setTempHighLevelScope] = useState([...highLevelScope]);
    const [scopeDataSuggestions, setScopeDataSuggestions] = useState([]);
    useEffect(() => {
    const fetchScopes = async () => {
      const scopes = await get_scopes();
      setScopeDataSuggestions(scopes);
    };
    fetchScopes();
  }, []);
//   console.log(scopeDataSuggestions);
    // Reset temp state when exiting edit mode or when highLevelScope changes
    useEffect(() => {
        if (!isEditing) {
            setTempHighLevelScope([...highLevelScope]);
        }
    }, [isEditing, highLevelScope]);

    // Update parent's state when tempHighLevelScope changes
    // useEffect(() => {
    //     if (typeof setHighLevelScope === 'function') {
    //         setHighLevelScope(tempHighLevelScope);
    //     }
    // }, [tempHighLevelScope, setHighLevelScope]);
    useEffect(() => {
    if (typeof setHighLevelScope === 'function') {
        setHighLevelScope(prev => {
            const isSame = JSON.stringify(prev) === JSON.stringify(tempHighLevelScope);
            return isSame ? prev : tempHighLevelScope;
        });
    }
}, [tempHighLevelScope, setHighLevelScope]);

    const handleInputChange = (index, newValue) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].version = newValue;
        console.log("updated scope ",updatedScope);
        setTempHighLevelScope(updatedScope);
        // console.log("temp high level scope : ", tempHighLevelScope);
    };

    const handleAddScope = () => {
        setTempHighLevelScope(prev => [...prev, { name: '', version: '' }]);
    };

    const handleRemoveScope = (index, e) => {
        e.preventDefault();
        setTempHighLevelScope(prev => prev.filter((_, i) => i !== index));
    };

    // Search suggestions for labels
    const labelRefs = useRef([]);
    const [labelSuggestions, setLabelSuggestions] = useState([]);

    const handleLabelChange = (index, newLabel) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].name = newLabel;
        setTempHighLevelScope(updatedScope);

        const filteredSuggestions = newLabel.trim()
            ? scopeDataSuggestions.filter(s =>
                s.name.toLowerCase().includes(newLabel.toLowerCase())
            )
            : [];

        const updatedSuggestions = [...labelSuggestions];
        updatedSuggestions[index] = filteredSuggestions;
        setLabelSuggestions(updatedSuggestions);
    };

    const handleSuggestionClick = (index, suggestion) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].name = suggestion.name;
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
                                        <div
                                            style={{ position: 'relative' }}
                                            ref={(el) => (labelRefs.current[index] = el)}
                                        >
                                            <input
                                                type="text"
                                                value={item.name}
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
                                    <td>{item.name}</td>
                                    <td>{item.version}</td>
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
