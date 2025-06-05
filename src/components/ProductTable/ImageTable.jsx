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


    const [patchData, setPatchData] = useState(null);
    const [Productsdata, setProductsdata] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPatchById(patchname); // assuming this returns the JSON you posted
                console.log('🔄 Full patch data:', data);

                // Extract products_data
                const products_data = data.products;
                setPatchData(data);
                setProductsdata(products_data)
                console.log(' Products data:', products_data);
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
