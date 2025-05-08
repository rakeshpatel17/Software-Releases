// components/ProductTable.js
import React, { useState } from 'react';
import './ImageTable.css'; // optional if you want separate styling

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
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');

    const toggleRow = (idx) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };

    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Build Number</th>
                    <th>Release Date</th>
                    <th>OT2 Pass</th>
                    <th>Twist Lock Report</th>
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
                            <td>{new Date(img.release_date).toLocaleDateString()}</td>
                            <td>{highlightMatch(img.ot2_pass, searchTerm)}</td>
                            <td>
                                <a href={img.twistlock_report_url} target="_blank" rel="noopener noreferrer">
                                    View Report
                                </a>
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
                                                                    {editingIndex === index ? (
                                                                        <>
                                                                            <textarea
                                                                                value={editedDescription}
                                                                                onChange={(e) => setEditedDescription(e.target.value)}
                                                                                rows={3}
                                                                                style={{ width: '100%' }}
                                                                            />
                                                                            <button
                                                                                style={{ marginTop: '4px' }}
                                                                                onClick={() => {
                                                                                    const updatedIssues = [...img.security_issues];
                                                                                    updatedIssues[index].description = editedDescription;
                                                                                    img.security_issues = updatedIssues;
                                                                                    setEditingIndex(null);
                                                                                }}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div style={{ marginBottom: '4px' }}>{issue.description}</div>
                                                                            <button onClick={() => {
                                                                                setEditingIndex(index);
                                                                                setEditedDescription(issue.description);
                                                                            }}>
                                                                                Edit
                                                                            </button>
                                                                        </>
                                                                    )}
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
