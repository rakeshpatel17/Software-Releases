// components/ProductTable.js
import React, { useState, useEffect } from 'react';
import './ImageTable.css'; // separate styling
import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent from '../ToggleButton/ToggleButton';
import get_security_issues from '../../api/securityIssues';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';
import { getPatchById } from '../../api/getPatchById';

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

function ImageTable({ images, patchname, searchTerm }) {
    const [expandedRows, setExpandedRows] = useState({});
    // const [editingIndex, setEditingIndex] = useState(null);
    // const [editedDescription, setEditedDescription] = useState('');

    // console.log("data",images)
    const [loading, setLoading] = useState(true);
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
            setToggleRegisteryValues(images.map(img => getToggleValue(img.registry)));
            setToggleOT2Values(images.map(img => getToggleValue(img.ot2_pass)));
            setToggleHelmValues(images.map(img => getToggleValue(img.helm_charts)));
        }
    }, [images]);



    const getToggleValue = (dbValue) => {
        const options = ['Released', 'Not Released', 'Not Applicable'];
        const matchIndex = options.findIndex(opt => opt.toLowerCase() === dbValue?.toLowerCase());
        return matchIndex !== -1 ? options[matchIndex] : 'Not Released'; // Default fallback
    };

    const [filter, setFilter] = useState('all');
    const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    const levels = ['critical','high','medium','low'];
    const [selected, setSelected] = useState(new Set(levels));
    const severityColors = {
        low:      '#008000',   // green
        medium:   '#FFD700',   // gold
        high:     '#FF8C00',   // dark orange
        critical: '#FF0000',   // red
    };
    

    const [patchData, setPatchData] = useState(null);
    const [Productsdata, setProductsdata] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPatchById(patchname); // assuming this returns the JSON you posted
                // console.log(' Full patch data:', data);

                // Extract products_data
                const products_data = data.products;
                setPatchData(data);
                setProductsdata(products_data)
                // console.log(' Products data:', products_data);
                setLoading(false);
            } catch (error) {
                console.error(' Error fetching patch data:', error);
            }
        }

        fetchData();
    }, [patchname]);




    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Build Number</th>
                    <th>Registery</th>
                    <th>OT2 Pass</th>
                    {/* <th>Helm Charts</th> */}
                    <th>Status</th>
                    <th>More Details</th>
                </tr>
            </thead>
            <tbody>
                {images.map((img, idx) => {
                    const displayed = img.security_issues
                    .slice()
                    .sort((a, b) => {
                        const sa = severityOrder[a.severity.toLowerCase()];
                        const sb = severityOrder[b.severity.toLowerCase()];
                        if (sa !== sb) return sa - sb;               // severity order
                        return b.cvss_score - a.cvss_score;          // then CVSS desc
                    })
                    .filter(issue => selected.has(issue.severity.toLowerCase()));
            
                 return (
                    <React.Fragment key={idx}>
                        <tr>
                            <td>{img.image_name}</td>
                            <td>{highlightMatch(img.patch_build_number, searchTerm)}</td>
                            <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleOT2Values[idx]}
                                    onToggle={(newValue) => handleOT2Toggle(idx, newValue)}
                                />

                            </td>
                            <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleRegisteryValues[idx]}
                                    onToggle={(newValue) => handleRegisteryToggle(idx, newValue)}
                                /></td>
                            {/* <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleHelmValues[idx]}
                                    onToggle={(newValue) => handleHelmToggle(idx, newValue)}
                                />
                            </td> */}
                            <td>
                                { img.security_issues.length == 0 ? (
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
                        {expandedRows[idx] && !loading && (
                            <tr>
                                <td colSpan="6">
                                    <div className="expanded-content">

                                        <p style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <span ><strong>Twist Lock Report: </strong><a href={img.twistlock_report_url } target="_blank" rel="noopener noreferrer">
                                                View Report
                                            </a></span>
                                            {/* <span><strong>Twistlock Report Clean:</strong> {img.twistlock_report_clean ? 'Yes' : 'No'}</span> */}
                                            <span><strong>Created At:</strong> {new Date(img.created_at).toLocaleString()}</span>
                                        </p>
                                        <div style={{ marginTop: '12px' }}>
                                            <strong>Security Issues:</strong>
                                            {img.security_issues.length > 0 ? (
                                                <>
                                                {/* buttons */}
                                                    {(() => {
                                                    // 1) compute counts per severity
                                                    const severityCounts = img.security_issues.reduce((acc, issue) => {
                                                        const sev = issue.severity.toLowerCase();
                                                        acc[sev] = (acc[sev] || 0) + 1;
                                                        return acc;
                                                    }, {});
                                                    const totalCount = img.security_issues.length;
                                                    const isAll = selected.size === levels.length;

                                                    return (
                                                        <div style={{ marginBottom: 8 }}>
                                                        {/* All toggle */}
                                                        <button
                                                            onClick={() =>
                                                            setSelected(prev => (isAll ? new Set() : new Set(levels)))
                                                            }
                                                            style={{
                                                            marginRight: 12,
                                                            padding: '4px 8px',
                                                            fontWeight: isAll ? 'bold' : 'normal',
                                                            opacity: isAll ? 1 : 0.6,
                                                            color: '#20338b',
                                                            }}
                                                        >
                                                            All ({totalCount})
                                                        </button>

                                                        {/* Per‑level toggles with counts */}
                                                        {levels.map(level => {
                                                            const isOn = selected.has(level);
                                                            const count = severityCounts[level] || 0;
                                                            return (
                                                            <button
                                                                key={level}
                                                                onClick={() => {
                                                                const copy = new Set(selected);
                                                                if (copy.has(level)) copy.delete(level);
                                                                else copy.add(level);
                                                                setSelected(copy);
                                                                }}
                                                                style={{
                                                                marginLeft: 6,
                                                                padding: '4px 8px',
                                                                fontWeight: isOn ? 'bold' : 'normal',
                                                                opacity: isOn ? 1 : 0.6,
                                                                color: severityColors[level]
                                                                }}
                                                            >
                                                                {level.charAt(0).toUpperCase() + level.slice(1)} ({count})
                                                            </button>
                                                            );
                                                        })}
                                                        </div>
                                                    );
                                                    })()}
                                                {/*rendering table if there are items after filtering */}
                                                {displayed.length > 0 ? (
                                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>CVE ID</th>
                                                            <th>CVSS Score</th>
                                                            <th>Severity</th>
                                                            <th>Affected Libraries</th>
                                                            {/* <th>Library Path</th> */}
                                                            <th>Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            displayed.map((issue, index) => (
                                                            <tr key={index}>
                                                                <td>{issue.cve_id}</td>
                                                                <td>{issue.cvss_score}</td>
                                                                <td
                                                                    style={{
                                                                        color: severityColors[issue.severity.toLowerCase()],
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                    >
                                                                    {issue.severity}
                                                                </td>
                                                                <td>{issue.affected_libraries}</td>
                                                                {/* <td>{issue.library_path}</td> */}
                                                                <td>
                                                                    <EditableFieldComponent
                                                                        value={
                                                                            Productsdata.find(p => p.name === img.product)?.product_security_des || '—'
                                                                        }
                                                                        onSave={async (newValue) => {
                                                                            const updatedProducts = [...Productsdata]; // shallow copy

                                                                            // Find product that contains this image
                                                                            const productIndex = updatedProducts.findIndex(p =>
                                                                                p.images.some(i =>
                                                                                    i.image_name === img.image_name &&
                                                                                    i.patch_build_number === img.patch_build_number
                                                                                )
                                                                            );

                                                                            if (productIndex !== -1) {
                                                                                updatedProducts[productIndex].product_security_des = newValue;

                                                                                try {
                                                                                    await securityIssuesUpdate(patchname, { products_data: updatedProducts });

                                                                                    // 🔁 REFRESH DATA FROM BACKEND
                                                                                    const refreshed = await getPatchById(patchname);
                                                                                    setProductsdata(refreshed.products);
                                                                                    console.log(" Refreshed Products:", refreshed.products);
                                                                                } catch (error) {
                                                                                    console.error("Error updating product_security_des:", error.message);
                                                                                    alert("Update failed");
                                                                                }
                                                                            } else {
                                                                                console.warn(" Product not found for image", img.image_name);
                                                                            }
                                                                        }}

                                                                    />
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                ) : (
                                                <p style={{ marginTop: 8, fontStyle: 'italic' }}>
                                                    No security issues...
                                                </p>
                                                )}
                                                </>
                                            ) : (
                                                <p>None</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                 )
                })}
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
