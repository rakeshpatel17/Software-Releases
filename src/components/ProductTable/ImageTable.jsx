// components/ProductTable.js
import React, { useState ,useEffect} from 'react';
import './ImageTable.css'; // separate styling
import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent from '../ToggleButton/ToggleButton';
import get_security_issues from '../../api/securityIssues';

function highlightMatch(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} className="highlight">{part}</span>
        ) : (
            part
        )
    );
}

function ImageTable({ images, searchTerm }) {
    const [expandedRows, setExpandedRows] = useState({});
    // const [editingIndex, setEditingIndex] = useState(null);
    // const [editedDescription, setEditedDescription] = useState('');

  

    const toggleRow = (idx) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };

    const [toggleRegisteryValues, setToggleRegisteryValues] = useState(() =>
        images.map(() => 'Released')
    );
    

    const handleRegisteryToggle = (idx, newValue) => {
        const updatedValues = [...toggleRegisteryValues];
        updatedValues[idx] = newValue;
        setToggleRegisteryValues(updatedValues);
    };

    const [toggleOT2Values, setToggleOT2Values] = useState(() =>
        images.map(() => 'Released')
    );
    const handleOT2Toggle = (idx, newValue) => {
        const updatedValues = [...toggleOT2Values];
        updatedValues[idx] = newValue;
        setToggleOT2Values(updatedValues);
    };

    const [toggleHelmValues, setToggleHelmValues] = useState(() =>
        images.map(() => 'Released')
    );
    const handleHelmToggle = (idx, newValue) => {
        const updatedValues = [...toggleHelmValues];
        updatedValues[idx] = newValue;
        setToggleHelmValues(updatedValues);
    };
    useEffect(() => {
        if (images.length > 0) {
          setToggleRegisteryValues(images.map(() => 'Released'));
          setToggleOT2Values(images.map(() => 'Released'));
          setToggleHelmValues(images.map(() => 'Released'));
        }
      }, [images]);



    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Build Number</th>
                    <th>Registery</th>
                    <th>OT2 Pass</th>
                    <th>Helm Charts</th>
                    <th>Status</th>
                    <th>More Details</th>
                </tr>
            </thead>
            <tbody>
                {images.map((img, idx) => (
                    <React.Fragment key={idx}>
                        <tr>
                            <td>{img.image_name}</td>
                            <td>{highlightMatch(img.build_number, searchTerm)}</td>
                            <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleRegisteryValues[idx]}
                                    onToggle={(newValue) => handleRegisteryToggle(idx, newValue)}
                                />

                            </td>
                            <td>   <ToggleButtonComponent
                                options={['Released', 'Not Released', 'Not Applicable']}
                                value={toggleOT2Values[idx]}
                                onToggle={(newValue) => handleOT2Toggle(idx, newValue)}
                            /></td>
                            <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleHelmValues[idx]}
                                    onToggle={(newValue) => handleHelmToggle(idx, newValue)}
                                />
                            </td>
                            <td>
                                {img.twistlock_report_clean ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}> ✔ Success </span>
                                ) : (
                                    <span style={{ color: 'red', fontWeight: 'bold' }}> ✖ Fail </span>
                                )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => toggleRow(idx)}>
                                    {expandedRows[idx] ? '▲' : '▼'}
                                </button>
                            </td>
                        </tr>
                        {expandedRows[idx] && (
                            <tr>
                                <td colSpan="7">
                                    <div className="expanded-content">

                                        <p style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <span ><strong>Twist Lock Report: </strong><a href={img.twistlock_report_url} target="_blank" rel="noopener noreferrer">
                                                View Report
                                            </a></span>
                                            <span><strong>Twistlock Report Clean:</strong> {img.twistlock_report_clean ? 'Yes' : 'No'}</span>
                                            <span><strong>Created At:</strong> {new Date(img.created_at).toLocaleString()}</span>
                                        </p>
                                        <div style={{ marginTop: '12px' }}>
                                            <strong>Security Issues:</strong>
                                            {img.security_issues.length > 0 ? (
                                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>CVE ID</th>
                                                            <th>CVSS Score</th>
                                                            <th>Severity</th>
                                                            <th>Affected Libraries</th>
                                                            <th>Library Path</th>
                                                            <th>Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {img.security_issues.map((issue, index) => (
                                                            <tr key={index}>
                                                                <td>{issue.cve_id}</td>
                                                                <td>{issue.cvss_score}</td>
                                                                <td>{issue.severity}</td>
                                                                <td>{issue.affected_libraries}</td>
                                                                <td>{issue.library_path}</td>
                                                                <td>
                                                                    <EditableFieldComponent
                                                                        value={issue.description}
                                                                        onSave={(newValue) => {
                                                                            const updatedIssues = [...img.security_issues];
                                                                            updatedIssues[index].description = newValue;
                                                                            img.security_issues = updatedIssues;
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>None</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                {images.length === 0 && (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                            No images found for this product.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default ImageTable;
