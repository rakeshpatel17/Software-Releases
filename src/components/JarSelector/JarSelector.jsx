import { useState, useEffect, useRef } from 'react';
import './JarSelector.css';
import get_jars from '../../api/get_jars';
import { Trash2 } from 'lucide-react';

function JarSelector({ selectedJars, setSelectedJars, isEditing }) {
    const [jarDataSuggestions, setJarDataSuggestions] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [dropdowns, setDropdowns] = useState([]);
    useEffect(() => {
        const fetchJars = async () => {
        const jars = await get_jars();
        setJarDataSuggestions(jars);
        };
        fetchJars();
    }, []);
    const handleJarChange = (index, field, value) => {
        const updated = [...selectedJars];
        updated[index][field] = value;
        setSelectedJars(updated);

        if (field === 'name') {
            const updatedDropdowns = [...dropdowns];
            if (value.trim() === '') {
                updatedDropdowns[index] = [];
            } else {
                updatedDropdowns[index] = jarDataSuggestions.filter(jar =>
                    jar.name.toLowerCase().includes(value.toLowerCase())
                );
            }
            setDropdowns(updatedDropdowns);
        }
    };

    const handleAddJar = () => {
        setSelectedJars(prev => [...prev, { name: '', version: '', remarks: '' }]);
        setDropdowns(prev => [...prev, []]);
    };

    const handleRemoveJar = (index) => {
        setSelectedJars(prev => prev.filter((_, i) => i !== index));
        setDropdowns(prev => prev.filter((_, i) => i !== index));
    };

    const handleSelectSuggestion = (index, name) => {
        handleJarChange(index, 'name', name);
        const updatedDropdowns = [...dropdowns];
        updatedDropdowns[index] = [];
        setDropdowns(updatedDropdowns);
    };

    const labelRefs = useRef([]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            const updatedDropdowns = dropdowns.map((d, i) => {
                const refEl = labelRefs.current[i];
                if (refEl && !refEl.contains(event.target)) {
                    return [];
                }
                return d;
            });
            setDropdowns(updatedDropdowns);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdowns]);

    return (
        <div className="form-group jar-selector-edit">
            {!isEditing ? (
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
                            {selectedJars.map((jar, index) => (
                                <tr key={index}>
                                    <td>{jar.name}</td>
                                    <td>{jar.version}</td>
                                    <td>{jar.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
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
                                    <td style={{ position: 'relative' }} ref={(el) => (labelRefs.current[index] = el)}>
                                        <input
                                            type="text"
                                            value={jar.name}
                                            onChange={(e) => handleJarChange(index, 'name', e.target.value)}
                                            onFocus={() => setFocusedIndex(index)}
                                            onBlur={() => setTimeout(() => setFocusedIndex(null), 100)}
                                            placeholder="Jar name"
                                            className="jar-selector-edit-input"
                                        />
                                        {focusedIndex === index && dropdowns[index]?.length > 0 && (
                                            <div className="jar-dropdown">
                                                {dropdowns[index].map((suggestion, i) => (
                                                    <div
                                                        key={i}
                                                        className="jar-dropdown-item"
                                                        onClick={() => handleSelectSuggestion(index, suggestion.name)}
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
                                            onChange={(e) => handleJarChange(index, 'version', e.target.value)}
                                            placeholder="Version"
                                            className="jar-selector-edit-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={jar.remarks}
                                            onChange={(e) => handleJarChange(index, 'remarks', e.target.value)}
                                            placeholder="Remarks"
                                            className="jar-selector-edit-input"
                                        />
                                    </td>
                                    <td className="lastchild">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveJar(index)}
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
                        onClick={handleAddJar}
                    >
                        + Add JAR
                    </button>
                </>
            )}
        </div>
    );
}

export default JarSelector;
